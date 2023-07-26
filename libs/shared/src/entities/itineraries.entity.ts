import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusEntity } from './bus.entity';
import { ReservationEntity } from './reservation.entity';

@Entity({ name: 'itineraries' })
export class ItineraryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'closing_time',
    type: 'date',
  })
  closingTime: Date;

  @Column({
    name: 'opening_time',
    type: 'date',
  })
  openingTime: Date;

  @Column({
    name: 'ticket_price',
    type: 'decimal',
  })
  ticketPrice: number;

  @Column({
    name: 'max_capacity',
    type: 'int',
  })
  maxCapacity: number;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({
    name: 'available_seats',
    type: 'int',
  })
  availableSeats: number;

  @ManyToOne(() => BusEntity, (bus) => bus.itineraries)
  @JoinColumn()
  bus: BusEntity;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.itinerary)
  reservations: ReservationEntity[];
}
