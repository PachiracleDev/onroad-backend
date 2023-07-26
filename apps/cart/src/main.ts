import { NestFactory } from '@nestjs/core';
import { CartModule } from './cart.module';
import { ConfigService } from '@nestjs/config';
import { SharedService } from '@app/shared/services/shared.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(CartModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const QUEUE = configService.get<string>('RABBITMQ_CART_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(QUEUE));

  await app.startAllMicroservices();
}
bootstrap();
