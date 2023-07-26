import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OperatorEntity } from './operator.entity';
import { ItineraryEntity } from './itineraries.entity';

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

  @ManyToOne(() => OperatorEntity, (operator) => operator.buses)
  @JoinColumn()
  operator: OperatorEntity;

  @ManyToOne(() => ItineraryEntity, (itinerary) => itinerary.id)
  itineraries: ItineraryEntity[];
}
