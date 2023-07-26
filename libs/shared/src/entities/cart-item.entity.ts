import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartEntity } from './cart.entity';
import { ItineraryEntity } from './itineraries.entity';
import { SeatType } from '../enums/seat-type.enum';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @ManyToOne(() => ItineraryEntity, (itinerary) => itinerary.id)
  @JoinColumn({ name: 'itinerary_id' })
  itinerarie: ItineraryEntity;

  @Column({
    type: 'int',
  })
  quantity: number;

  @Column({
    type: 'enum',
    enum: SeatType,
  })
  seatType: SeatType;
}
