import { ReservationEntity } from '@app/shared/entities/reservation.entity';
import { ItemCart } from 'apps/api/src/dto/create-payment-intent.dto';

export interface ReservationServiceInterface {
  getAllReservations(): Promise<ReservationEntity[]>;
  createReservation(
    userId: number,
    items: ItemCart[],
  ): Promise<ReservationEntity[]>;
  getMyReservations(userId: number): Promise<ReservationEntity[]>;
  missingOneDayToDeparture(): Promise<ReservationEntity[]>;
}
