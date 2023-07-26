import { InjectRepository } from '@nestjs/typeorm';
import { ReservationEntity } from '../entities/reservation.entity';
import { ReservationRepositoryInterface } from '../interfaces/repository/reservation.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { Repository } from 'typeorm';

export class ReservationRepository
  extends BaseAbstractRepository<ReservationEntity>
  implements ReservationRepositoryInterface
{
  constructor(
    @InjectRepository(ReservationEntity)
    readonly reservationRepository: Repository<ReservationEntity>,
  ) {
    super(reservationRepository);
  }

  async upcomingReservations() {
    //Exacatamente 1 día antes de que parta el bus.
    const oneMissingDay = new Date();
    oneMissingDay.setDate(oneMissingDay.getDate() + 1);

    const twoMissingDays = new Date();
    twoMissingDays.setDate(twoMissingDays.getDate() + 2);

    return await this.reservationRepository
      .createQueryBuilder('reservations')
      .leftJoinAndSelect('reservations.itinerary', 'itinerary')
      .leftJoinAndSelect('reservations.customer', 'customer')
      // .where('itinerary.closingTime >= :oneMissingDay', { oneMissingDay })
      // .andWhere('itinerary.closingTime < :twoMissingDays', { twoMissingDays })
      .getMany();
  }
}
