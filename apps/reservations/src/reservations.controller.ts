import { Controller, Inject } from '@nestjs/common';

import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { SharedServiceInterface } from '@app/shared/interfaces/services/shared.service.interface';
import { ReservationServiceInterface } from '../interfaces/reservation.service.interface';
import { ReservationEntity } from '@app/shared/entities/reservation.entity';
import { ItemCart } from 'apps/api/src/dto/create-payment-intent.dto';

@Controller()
export class ReservationsController {
  constructor(
    @Inject('SharedServiceInterface')
    private sharedService: SharedServiceInterface,
    @Inject('ReservationServiceInterface')
    private reservationService: ReservationServiceInterface,
  ) {}

  @MessagePattern({ cmd: 'create-reservation' })
  async createReservation(
    @Ctx() ctx: RmqContext,
    @Payload() payload: { userId: number; items: ItemCart[] },
  ): Promise<ReservationEntity[]> {
    this.sharedService.acknowledgeMessage(ctx);
    return this.reservationService.createReservation(
      payload.userId,
      payload.items,
    );
  }

  @MessagePattern({ cmd: 'get-my-reservations' })
  async getMyReservations(
    @Ctx() ctx: RmqContext,
    @Payload() payload: { userId: number },
  ): Promise<ReservationEntity[]> {
    this.sharedService.acknowledgeMessage(ctx);
    return this.reservationService.getMyReservations(payload.userId);
  }

  @MessagePattern({ cmd: 'missingOneDayToDeparture' })
  async missingOneDayToDeparture(
    @Ctx() ctx: RmqContext,
  ): Promise<ReservationEntity[]> {
    this.sharedService.acknowledgeMessage(ctx);
    return this.reservationService.missingOneDayToDeparture();
  }

  @MessagePattern({ cmd: 'get-all-reservations' })
  async getAllReservations(
    @Ctx() ctx: RmqContext,
  ): Promise<ReservationEntity[]> {
    this.sharedService.acknowledgeMessage(ctx);
    return this.reservationService.getAllReservations();
  }
}
