import { Controller } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { SharedService } from '@app/shared/services/shared.service';
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-active-user' })
  async getActiveUser(@Ctx() ctx: any, @Payload() payload: { id: number }) {
    this.sharedService.acknowledgeMessage(ctx);
    return await this.presenceService.getActiveUser(payload.id);
  }
}
