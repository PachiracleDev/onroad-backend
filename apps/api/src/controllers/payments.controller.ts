import {
  Body,
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { CreatePaymentIntent } from '../dto/create-payment-intent.dto';
import RequestWithRawBody from '../interfaces/requestWithRawBody.interface';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard)
  @Post('create-payment-intent')
  createPaymentIntent(@Body() body: CreatePaymentIntent, @Req() req: Request) {
    return this.paymentsService.createPaymentIntent(body, req.user.id);
  }

  @Post('/webhook')
  async webhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RequestWithRawBody,
  ) {
    if (!signature) {
      throw new BadRequestException('Stripe signature is required');
    }
    return this.paymentsService.constructEvent(req.rawBody, signature);
  }
}
