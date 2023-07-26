import {
  Controller,
  Inject,
  Post,
  Delete,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { AddItemToCartDto } from 'apps/cart/src/dto/add-item-to-cart.dto';

import { Request } from 'express';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { RemoveItemToCartDto } from 'apps/cart/src/dto/remove-item-to-cart.dto';
import { ClientProxy } from '@nestjs/microservices';
import { sendMicroserviceMessage } from '@app/shared/utils/send-message-microservice';

import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(
    @Inject('CART_SERVICE') private readonly cartService: ClientProxy,
  ) {}

  @Get('get-cart')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get cart',
    description: 'This endpoint is used to get cart.',
  })
  async getCart2(@Req() req: Request) {
    return sendMicroserviceMessage(this.cartService, 'get-cart', {
      userId: req.user.id,
    });
  }

  @Post('add-item-to-cart')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Add item to cart',
    description: 'This endpoint is used to add item to cart.',
  })
  async addItemToCart(@Req() req: Request, @Body() dto: AddItemToCartDto) {
    return sendMicroserviceMessage(this.cartService, 'add-item-to-cart', {
      ...dto,
      userId: req.user.id,
    });
  }

  @Delete('remove-item-from-cart')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Remove item from cart',
    description: 'This endpoint is used to remove item from cart.',
  })
  async removeItemFromCart(
    @Body() dto: RemoveItemToCartDto,
    @Req() req: Request,
  ) {
    return sendMicroserviceMessage(this.cartService, 'remove-item-from-cart', {
      ...dto,
      userId: req.user.id,
    });
  }

  @Delete('clear-cart')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Clear cart',
    description: 'This endpoint is used to clear cart.',
  })
  async clearCart2(@Req() req: Request) {
    return sendMicroserviceMessage(this.cartService, 'clear-cart', {
      userId: req.user.id,
    });
  }
}
