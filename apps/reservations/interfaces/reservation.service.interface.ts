import { ReservationEntity } from '@app/shared/entities/reservation.entity';

export interface ReservationServiceInterface {
  getAllReservations(): Promise<ReservationEntity[]>;
  createReservation(userId: number): Promise<ReservationEntity[]>;
  getMyReservations(userId: number): Promise<ReservationEntity[]>;
  missingOneDayToDeparture(): Promise<ReservationEntity[]>;
}
