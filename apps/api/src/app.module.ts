import { Module } from '@nestjs/common';

import { SharedModule } from '@app/shared/modules/shared.module';
import { UsersController } from './controllers/users.controller';
import { OperatorsController } from './controllers/operators.controller';
import { BusController } from './controllers/bus.controller';
import { ItinerariesController } from './controllers/itineraries.controller';
import { ReservationController } from './controllers/reservation.controller';
import { CartController } from './controllers/cart.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { EmailsService } from '@app/shared/services/emails.service';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentsService } from './services/payments.service';
import { S3Controller } from '@app/shared/controllers/aws-s3.controller';
import { S3Service } from '@app/shared/services/aws-s3.service';

@Module({
  imports: [
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq(
      'PRESENCE_SERVICE',
      process.env.RABBITMQ_PRESENCE_QUEUE,
    ),
    SharedModule.registerRmq(
      'ITINERARIES_SERVICE',
      process.env.RABBITMQ_ITINERARIES_QUEUE,
    ),
    SharedModule.registerRmq(
      'RESERVATIONS_SERVICE',
      process.env.RABBITMQ_RESERVATIONS_QUEUE,
    ),
    SharedModule.registerRmq('CART_SERVICE', process.env.RABBITMQ_CART_QUEUE),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    UsersController,
    OperatorsController,
    BusController,
    ItinerariesController,
    ReservationController,
    CartController,
    PaymentsController,
    S3Controller,
  ],
  providers: [CronService, EmailsService, PaymentsService, S3Service],
})
export class AppModule {}
