import { Controller, Inject } from '@nestjs/common';

import { CarServiceInterface } from './interfaces/cart.service.interface';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared/services/shared.service';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';

import { RemoveItemToCartDto } from './dto/remove-item-to-cart.dto';

@Controller()
export class CartController {
  constructor(
    @Inject('CarServiceInterface')
    private readonly cartService: CarServiceInterface,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-cart' })
  async getCart(
    @Ctx() ctx: RmqContext,
    @Payload() payload: { userId: number },
  ) {
    this.sharedService.acknowledgeMessage(ctx);
    return this.cartService.getCart(payload.userId);
  }

  @MessagePattern({ cmd: 'add-item-to-cart' })
  async addItemToCart(
    @Ctx() ctx: RmqContext,
    @Payload() payload: AddItemToCartDto & { userId: number },
  ) {
    this.sharedService.acknowledgeMessage(ctx);
    return this.cartService.addItemToCart(payload, payload.userId);
  }

  @MessagePattern({ cmd: 'remove-item-from-cart' })
  async removeItemFromCart(
    @Payload() payload: RemoveItemToCartDto & { userId: number },
    @Ctx() ctx: RmqContext,
  ) {
    this.sharedService.acknowledgeMessage(ctx);
    return this.cartService.removeItemFromCart(payload, payload.userId);
  }
  @MessagePattern({ cmd: 'clear-cart' })
  async clearCart2(
    @Ctx() ctx: RmqContext,
    @Payload() payload: { userId: number },
  ) {
    await this.sharedService.acknowledgeMessage(ctx);
    return this.cartService.clearCart(payload.userId);
  }
}
