import { RedisCacheService } from '@app/shared/services/redis-cache.service';
import { Injectable } from '@nestjs/common';
import { PresenceServiceInterface } from './interfaces/presence.service.interface';
import { ActiveUser } from './interfaces/active-user.interface';

@Injectable()
export class PresenceService implements PresenceServiceInterface {
  constructor(private readonly cache: RedisCacheService) {}

  async getActiveUser(id: number): Promise<ActiveUser> {
    const user = await this.cache.get(`user ${id}`);

    return user as ActiveUser | undefined;
  }
}
