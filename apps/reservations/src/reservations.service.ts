import { Injectable, Inject } from '@nestjs/common';
import { ReservationServiceInterface } from '../interfaces/reservation.service.interface';
import { ReservationRepositoryInterface } from '@app/shared/interfaces/repository/reservation.repository.interface';
import { ReservationEntity } from '@app/shared/entities/reservation.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as uuid from 'uuid';
import { ItemCart } from 'apps/api/src/dto/create-payment-intent.dto';
import { sendMicroserviceMessage } from '@app/shared/utils/send-message-microservice';

@Injectable()
export class ReservationsService implements ReservationServiceInterface {
  constructor(
    @Inject('ReservationRepositoryInterface')
    private readonly reservationRepository: ReservationRepositoryInterface,
    @Inject('CART_SERVICE') private readonly cartService: ClientProxy,
    @Inject('ITINERARIES_SERVICE')
    private readonly itinerariesService: ClientProxy,
  ) {}

  async createReservation(
    userId: number,
    items: ItemCart[],
  ): Promise<ReservationEntity[]> {
    const tickets = [];

    for (const item of items) {
      const ticket = await this.reservationRepository.save({
        customer: userId as any,
        itinerary: item.itinerarieId as any,
        seats: item.seats,
        ticketId: uuid.v4().slice(0, 8).toUpperCase(),
        qrCodeImage: '', // SE PODRIA USAR EL SERVICIO DE S3 CON LA LIBRERIA QRCODE PARA LA SUBIDA DE LA IMAGEN
      });
      tickets.push(ticket);

      //OCUPAR ASIENTOS DEL ITINERARIO
      const obs = sendMicroserviceMessage(
        this.itinerariesService,
        'occupy-seats',
        {
          seats: item.seats.map((s) => s.number),
          itineraryId: item.itinerarieId,
        },
      );

      await firstValueFrom(obs).catch((err) => {
        throw new RpcException(err.message);
      });
    }

    const obs2 = this.cartService.send({ cmd: 'clear-cart' }, { userId });

    await firstValueFrom(obs2).catch((err) => {
      throw new RpcException(err.message);
    });

    return tickets;
  }

  async getAllReservations(): Promise<ReservationEntity[]> {
    return await this.reservationRepository.findAll();
  }

  async getMyReservations(userId: number): Promise<ReservationEntity[]> {
    return await this.reservationRepository.findAll({
      where: {
        customer: userId as any,
      },
      relations: ['itinerary'],
    });
  }

  async missingOneDayToDeparture(): Promise<ReservationEntity[]> {
    return await this.reservationRepository.upcomingReservations();
  }
}
