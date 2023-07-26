import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { SharedModule } from '@app/shared/modules/shared.module';
import { PresenceGateway } from './presence.gateway';
import { RedisModule } from '@app/shared/modules/redis.module';

@Module({
  imports: [
    RedisModule,
    SharedModule,
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
  ],
  controllers: [PresenceController],
  providers: [PresenceService, PresenceGateway],
})
export class PresenceModule {}
