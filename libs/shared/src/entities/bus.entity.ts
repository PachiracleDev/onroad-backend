import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OperatorEntity } from './operator.entity';
import { ItineraryEntity } from './itineraries.entity';
import { Seat } from 'apps/itineraries/src/dto/create-bus.dto';

@Entity()
export class BusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'car_plate',
  })
  carPlate: string;

  @Column({
    name: 'image_url',
  })
  imageUrl: string;

  //EL PORCENTAJE DE INCREMENTO DE CADA TIPO DE ASIENTO (TURISTA, EJECUTIVO, PREMIUM)
  @Column({
    name: 'porcentage_increase_seat_type',
    type: 'jsonb',
  })
  porcentageIncreaseSeatType: Record<string, number>;

  @Column({
    type: 'jsonb',
  })
  seats: Seat[];

  @ManyToOne(() => OperatorEntity, (operator) => operator.buses)
  @JoinColumn()
  operator: OperatorEntity;

  @ManyToOne(() => ItineraryEntity, (itinerary) => itinerary.id)
  itineraries: ItineraryEntity[];
}
