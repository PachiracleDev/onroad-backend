import { CartEntity } from '@app/shared/entities/cart.entity';
import { AddItemToCartDto } from '../dto/add-item-to-cart.dto';
import { RemoveItemToCartDto } from '../dto/remove-item-to-cart.dto';
import { CartItemEntity } from '@app/shared/entities/cart-item.entity';

export interface CarServiceInterface {
  createCart(userId: number): Promise<CartEntity>;
  addItemToCart(
    dto: AddItemToCartDto,
    userId: number,
  ): Promise<CartItemEntity[]>;
  removeItemFromCart(
    dto: RemoveItemToCartDto,
    userId: number,
  ): Promise<boolean>;
  getCart(userId: number): Promise<CartEntity>;
  clearCart(userId: number): Promise<boolean>;
}
