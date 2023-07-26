import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import config from '../../../../config';
import { ConfigType } from '@nestjs/config';

import { redisStore } from 'cache-manager-redis-yet';
import { RedisCacheService } from '../services/redis-cache.service';
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigType<typeof config>) => ({
        store: await redisStore({
          url: configService.redis.uri,
        }),
        isGlobal: true,
      }),
      isGlobal: true,
      inject: [config.KEY],
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisModule {}
