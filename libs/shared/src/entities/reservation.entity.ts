import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItineraryEntity } from './itineraries.entity';
import { SeatType } from '../enums/seat-type.enum';
import { UserEntity } from './user.entity';
import { ReservationStatus } from '../enums/reservation-status.enum';

@Entity('reservations')
export class ReservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ItineraryEntity, (itinerary) => itinerary.id)
  @JoinColumn()
  itinerary: ItineraryEntity;

  @Column({
    name: 'ticket_id',
    unique: true,
  })
  ticketId: string;

  @Column({
    type: 'enum',
    enum: SeatType,
  })
  seatType: SeatType;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  customer: UserEntity;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column()
  quantity: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}
