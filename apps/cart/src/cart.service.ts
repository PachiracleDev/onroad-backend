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
import { ItineraryEntity } from '@app/shared/entities/itineraries.entity';

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
      relations: ['items', 'items.itinerarie', 'items.itinerarie.bus'],
    });
    if (!cart) {
      return await this.createCart(userId);
    }

    cart.items = cart.items.map((item) => ({
      ...item,
      itinerarie: {
        id: item.itinerarie.id,
        closingTime: item.itinerarie.closingTime,
        openingTime: item.itinerarie.openingTime,
        baseTicketPrice: item.itinerarie.baseTicketPrice,
        origin: item.itinerarie.origin,
        destination: item.itinerarie.destination,
        porcentageIncreaseSeatType:
          item.itinerarie.bus.porcentageIncreaseSeatType,
      },
    }));

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

    const result = (await firstValueFrom(obs)) as ItineraryEntity | null;
    if (!result) {
      throw new RpcException('El itinerario no existe');
    }

    result.seats.map((seat) => {
      dto.seats.map((seat2) => {
        if (seat.number === seat2.number) {
          if (seat.occupied === true) {
            throw new RpcException(`El asiento ${seat.number} ya está ocupado`);
          }
        }
      });
    });

    await this.cartItemRepository.save({
      cart,
      itinerarie: result as any,
      seats: dto.seats,
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
        cart: {
          id: cart.id,
        },
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
      cart: {
        id: cart.id,
      },
    });
    return true;
  }
}
