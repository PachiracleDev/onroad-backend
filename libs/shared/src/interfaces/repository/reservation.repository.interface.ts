import { ReservationEntity } from '@app/shared/entities/reservation.entity';
import { BaseInterfaceRepository } from '@app/shared/respositories/base/base.interface.repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ReservationRepositoryInterface
  extends BaseInterfaceRepository<ReservationEntity> {
  upcomingReservations(): Promise<ReservationEntity[]>;
}
