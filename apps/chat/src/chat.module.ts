import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SharedModule } from '@app/shared/modules/shared.module';
import { DatabaseModule } from '@app/shared/modules/database.module';
import { RedisModule } from '@app/shared/modules/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { MessageRepository } from '@app/shared/respositories/messages.repository';
import { ConversationRepository } from '@app/shared/respositories/conversations.repository';

import { ALL_ENTITIES } from '@app/shared/entities';

@Module({
  imports: [
    DatabaseModule,
    RedisModule,
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq(
      'PRESENCE_SERVICE',
      process.env.RABBITMQ_PRESENCE_QUEUE,
    ),
    TypeOrmModule.forFeature(ALL_ENTITIES),
  ],
  controllers: [],
  providers: [
    ChatService,
    ChatGateway,
    {
      provide: 'MessageRepositoryInterface',
      useClass: MessageRepository,
    },
    {
      provide: 'ConversationRepositoryInterface',
      useClass: ConversationRepository,
    },
  ],
})
export class ChatModule {}
