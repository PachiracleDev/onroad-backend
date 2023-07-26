import { Injectable, Inject } from '@nestjs/common';
import { ReservationServiceInterface } from '../interfaces/reservation.service.interface';
import { ReservationRepositoryInterface } from '@app/shared/interfaces/repository/reservation.repository.interface';
import { ReservationEntity } from '@app/shared/entities/reservation.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as uuid from 'uuid';

@Injectable()
export class ReservationsService implements ReservationServiceInterface {
  constructor(
    @Inject('ReservationRepositoryInterface')
    private readonly reservationRepository: ReservationRepositoryInterface,
    @Inject('CART_SERVICE') private readonly cartService: ClientProxy,
  ) {}

  async createReservation(userId: number): Promise<ReservationEntity[]> {
    const obs = this.cartService.send(
      {
        cmd: 'get-cart',
      },
      { userId },
    );
    const result = await firstValueFrom(obs).catch((err) => {
      throw new RpcException(err.message);
    });

    if (!result) {
      throw new RpcException('Carrito no encontrado');
    }

    if (result.items.length === 0) {
      throw new RpcException('Carrito vacio');
    }

    result.items.map((item) => {
      if (item.quantity > item.itinerarie.availableSeats) {
        throw new RpcException('No hay suficientes asientos disponibles');
      }
      return item;
    });

    const tickets = [];

    for (const item of result.items) {
      const ticket = await this.reservationRepository.save({
        customer: userId as any,
        itinerary: item.itinerarie.id,
        quantity: item.quantity,
        seatType: item.seatType,
        ticketId: uuid.v4().slice(0, 8).toUpperCase(),
      });
      tickets.push(ticket);
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
    });
  }

  async missingOneDayToDeparture(): Promise<ReservationEntity[]> {
    return await this.reservationRepository.upcomingReservations();
  }
}
