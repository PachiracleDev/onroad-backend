import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import config from '../../../../config';
import { ConfigType } from '@nestjs/config';
import Stripe from 'stripe';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePaymentIntent } from '../dto/create-payment-intent.dto';
import { sendMicroserviceMessage } from '@app/shared/utils/send-message-microservice';
import { firstValueFrom } from 'rxjs';
import { ItineraryEntity } from '@app/shared/entities/itineraries.entity';
import { Seat } from 'apps/itineraries/src/dto/create-bus.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    @Inject('RESERVATIONS_SERVICE')
    private readonly reservationService: ClientProxy,
    @Inject('ITINERARIES_SERVICE')
    private readonly itinerariesService: ClientProxy,
  ) {
    this.stripe = new Stripe(this.configService.stripe.secretKey, {
      apiVersion: '2022-11-15',
    });
  }

  calculateAmount(requestdSeats: Seat[], itinerary: ItineraryEntity): number {
    let amount = 0;

    for (const requestedSeat of requestdSeats) {
      const seat = itinerary.seats.find(
        (seat) =>
          seat.number === requestedSeat.number && seat.occupied === false,
      );

      if (!seat) {
        throw new BadRequestException('Asiento no disponible');
      }

      //SE LE MULTIPLICA POR 100 PORQUE STRIPE TRABAJA CON CENTAVOS

      amount +=
        itinerary.baseTicketPrice *
        itinerary.bus.porcentageIncreaseSeatType[requestedSeat.type] *
        100;
    }

    return +amount.toFixed(0);
  }

  async createPaymentIntent(dto: CreatePaymentIntent, userId: number) {
    let amount = 0;
    for (const item of dto.items) {
      const obs = sendMicroserviceMessage(
        this.itinerariesService,
        'get-itinerary',
        { id: item.itinerarieId },
      );

      const itinerarie = (await firstValueFrom(obs)) as ItineraryEntity | null;
      if (!itinerarie) {
        throw new BadRequestException('Itinerario no encontrado');
      }

      amount += this.calculateAmount(item.seats, itinerarie);
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId,
        items: JSON.stringify(dto.items),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async constructEvent(rawBody: any, signature: string) {
    try {
      const webhookSecret =
        'whsec_b8e16ef6f53819268792e53ae6b4a079dde63e76be3f96c1a8cea1095e18d72e';
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );

      if (!event) throw new NotFoundException('Signature not found');

      switch (event.type) {
        case 'payment_intent.succeeded':
          const data = event.data.object as any;
          const userId = +data.metadata.userId;
          // Parseo las cadenas JSON
          const items = JSON.parse(data.metadata.items);
          const obs = sendMicroserviceMessage(
            this.reservationService,
            'create-reservation',
            {
              userId,
              items,
            },
          );

          await firstValueFrom(obs).catch((err) => {
            throw new BadRequestException(err.message);
          });

        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {}
  }
}
