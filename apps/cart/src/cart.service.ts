import { CartRepositoryInterface } from '@app/shared/interfaces/repository/cart.repository.interface';
import { CarServiceInterface } from './interfaces/cart.service.interface';
import { Injectable, Inject } from '@nestjs/common';
import { CartEntity } from '@app/shared/entities/cart.entity';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { RemoveItemToCartDto } from './dto/remove-item-to-cart.dto';
import { CartItemRepositoryInterface } from '@app/shared/interfaces/repository/cart-item.repository.interface';
import { CartItemEntity } from '@app/shared/entities/cart-item.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { sendMicroserviceMessage } from '@app/shared/utils/send-message-microservice';

@Injectable()
export class CartService implements CarServiceInterface {
  constructor(
    @Inject('CartRepositoryInterface')
    private readonly cartRepository: CartRepositoryInterface,
    @Inject('CartItemRepositoryInterface')
    private readonly cartItemRepository: CartItemRepositoryInterface,
    @Inject('ITINERARIES_SERVICE') private itinerariesService: ClientProxy,
  ) {}

  async getCart(userId: number): Promise<CartEntity> {
    const cart = await this.cartRepository.findByCondition({
      where: {
        user: userId as any,
      },
      relations: ['items', 'items.itinerarie'],
    });
    if (!cart) {
      return await this.createCart(userId);
    }
    return cart;
  }

  async createCart(userId: number): Promise<CartEntity> {
    return await this.cartRepository.save({
      user: userId as any,
    });
  }

  async addItemToCart(
    dto: AddItemToCartDto,
    userId: number,
  ): Promise<CartItemEntity[]> {
    const cart = await this.getCart(userId);
    const obs = sendMicroserviceMessage(
      this.itinerariesService,
      'get-itinerary',
      { id: dto.itemId },
    );

    const result = await firstValueFrom(obs);
    if (result?.status === 'error') {
      throw new RpcException(result.message);
    }

    if (result.availableSeats < dto.quantity) {
      throw new RpcException('No hay suficientes asientos disponibles');
    }

    await this.cartItemRepository.save({
      cart,
      itinerarie: result as any,
      seatType: dto.seatType,
      quantity: dto.quantity,
    });

    const newCart = await this.getCart(userId);

    return newCart.items as CartItemEntity[];
  }

  async removeItemFromCart(
    dto: RemoveItemToCartDto,
    userId: number,
  ): Promise<boolean> {
    const cart = await this.getCart(userId);
    const item = await this.cartItemRepository.findByCondition({
      where: {
        cart: cart.id as any,
        id: dto.itemId as any,
      },
    });
    if (!item) {
      throw new RpcException('El item no existe en tu carrito');
    }

    await this.cartItemRepository.remove(item);
    return true;
  }

  async clearCart(userId: number): Promise<boolean> {
    const cart = await this.getCart(userId);
    await this.cartItemRepository.deleteMany({
      cart: cart.id as any,
    });
    return true;
  }
}
