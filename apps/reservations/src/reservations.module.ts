import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ReservationRepository } from '@app/shared/respositories/reservation.repository';
import { DatabaseModule } from '@app/shared/modules/database.module';
import { ALL_ENTITIES } from '@app/shared/entities';
import { SharedModule } from '@app/shared/modules/shared.module';
import { SharedService } from '@app/shared/services/shared.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature(ALL_ENTITIES),
    SharedModule,
    SharedModule.registerRmq('CART_SERVICE', process.env.RABBITMQ_CART_QUEUE),
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq(
      'ITINERARIES_SERVICE',
      process.env.RABBITMQ_ITINERARIES_QUEUE,
    ),
  ],
  controllers: [ReservationsController],
  providers: [
    {
      provide: 'ReservationRepositoryInterface',
      useClass: ReservationRepository,
    },
    {
      provide: 'ReservationServiceInterface',
      useClass: ReservationsService,
    },
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class ReservationsModule {}
