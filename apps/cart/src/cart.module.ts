import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { DatabaseModule } from '@app/shared/modules/database.module';
import { CartRepository } from '@app/shared/respositories/cart.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '@app/shared/modules/shared.module';
import { SharedService } from '@app/shared/services/shared.service';
import { CartItemRepository } from '@app/shared/respositories/cart-item.repository';
import { ALL_ENTITIES } from '@app/shared/entities';

@Module({
  imports: [
    SharedModule,
    SharedModule.registerRmq(
      'ITINERARIES_SERVICE',
      process.env.RABBITMQ_ITINERARIES_QUEUE,
    ),
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    DatabaseModule,
    TypeOrmModule.forFeature(ALL_ENTITIES),
  ],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: 'CartRepositoryInterface',
      useClass: CartRepository,
    },
    {
      provide: 'CartItemRepositoryInterface',
      useClass: CartItemRepository,
    },
    {
      provide: 'CarServiceInterface',
      useClass: CartService,
    },
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class CartModule {}
