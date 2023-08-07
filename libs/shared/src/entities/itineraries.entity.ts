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
import { Seat } from 'apps/itineraries/src/dto/create-bus.dto';

export class SeatOpen extends Seat {
  occupied: boolean;
}

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
  baseTicketPrice: number;

  @Column({
    type: 'jsonb',
  })
  seats: SeatOpen[];

  @Column()
  origin: string;

  @Column()
  destination: string;

  @ManyToOne(() => BusEntity, (bus) => bus.itineraries)
  @JoinColumn()
  bus: BusEntity;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.itinerary)
  reservations: ReservationEntity[];
}
