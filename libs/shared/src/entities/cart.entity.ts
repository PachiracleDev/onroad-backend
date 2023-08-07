import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CartItemEntity } from './cart-item.entity';

@Entity({ name: 'carts' })
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, (user) => user.cart)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
  items: CartItemEntity[] | number[];
}
