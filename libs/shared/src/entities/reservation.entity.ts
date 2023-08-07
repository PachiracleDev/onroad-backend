import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItineraryEntity } from './itineraries.entity';
import { UserEntity } from './user.entity';
import { ReservationStatus } from '../enums/reservation-status.enum';
import { Seat } from 'apps/itineraries/src/dto/create-bus.dto';

@Entity('reservations')
export class ReservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ItineraryEntity, (itinerary) => itinerary.id)
  @JoinColumn()
  itinerary: ItineraryEntity;

  @Column()
  qrCodeImage: string;

  @Column()
  ticketId: string;

  @Column({
    type: 'jsonb',
  })
  seats: Seat[];

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  customer: UserEntity;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}
