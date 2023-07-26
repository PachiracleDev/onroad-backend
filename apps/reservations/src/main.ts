import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ConfigService } from '@nestjs/config';
import { SharedService } from '@app/shared/services/shared.service';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);

  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const QUEUE = configService.get('RABBITMQ_RESERVATIONS_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(QUEUE));
  await app.startAllMicroservices();
}
bootstrap();
