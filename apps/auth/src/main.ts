import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SharedService } from '@app/shared/services/shared.service';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true, // Si se envía un parámetro que no está definido en el DTO, se rechaza la petición
      whitelist: true, // Si se envía un parámetro que no está definido en el DTO, se ignora
    }),
  );

  const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(QUEUE)); // Se conecta el microservicio a RabbitMQ

  await app.startAllMicroservices();
}
bootstrap();
