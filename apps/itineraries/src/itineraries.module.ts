import { Module } from '@nestjs/common';
import { ItineratiesController } from './controllers/itineraries.controller';
import { ItineratiesService } from './services/itineraries.service';
import { DatabaseModule } from '@app/shared/modules/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItinerarieRepository } from '@app/shared/respositories/itinerarie.repository';
import { OperatorRepository } from '@app/shared/respositories/operator.repository';
import { BusRepository } from '@app/shared/respositories/bus.repository';
import { SharedService } from '@app/shared/services/shared.service';
import { SharedModule } from '@app/shared/modules/shared.module';
import { BusService } from './services/bus.service';
import { OperatorService } from './services/operator.service';
import { BusController } from './controllers/bus.controller';
import { OperatorsController } from './controllers/operators.controller';
import { ALL_ENTITIES } from '@app/shared/entities';

@Module({
  imports: [
    DatabaseModule,
    SharedModule,
    TypeOrmModule.forFeature(ALL_ENTITIES),
  ],
  controllers: [ItineratiesController, BusController, OperatorsController],
  providers: [
    {
      provide: 'ItinerariesRepositoryInterface',
      useClass: ItinerarieRepository,
    },
    {
      provide: 'OperatorRepositoryInterface',
      useClass: OperatorRepository,
    },
    {
      provide: 'BusRepositoryInterface',
      useClass: BusRepository,
    },
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
    {
      provide: 'BusServiceInterface',
      useClass: BusService,
    },
    {
      provide: 'ItineraryServiceInterface',
      useClass: ItineratiesService,
    },
    {
      provide: 'OperatorServiceInterface',
      useClass: OperatorService,
    },
  ],
})
export class ItineratiesModule {}
