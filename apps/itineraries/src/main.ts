import { SharedService } from './../../../libs/shared/src/services/shared.service';
import { NestFactory } from '@nestjs/core';
import { ItineratiesModule } from './itineraries.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ItineratiesModule);
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const QUEUE = configService.get('RABBITMQ_ITINERARIES_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(QUEUE));
  await app.startAllMicroservices();
}
bootstrap();
