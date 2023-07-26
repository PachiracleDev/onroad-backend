import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { ConfigService } from '@nestjs/config';
import { SharedService } from '@app/shared/services/shared.service';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const QUEUE = configService.get('RABBITMQ_CHAT_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(QUEUE));
  await app.startAllMicroservices();

  await app.listen(7000);
}
bootstrap();
