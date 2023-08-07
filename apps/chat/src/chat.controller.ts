import { Controller, Query, UseGuards, Get, Req } from '@nestjs/common';
import { GetOldMessagesDto } from './dto/get-old-messages.dto';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { RolesGuard } from 'apps/auth/src/guards/roles.guard';
import { Roles } from 'apps/auth/src/decorators/roles.decorator';
import { Role } from '@app/shared/enums/role.enum';
import { ChatService } from './chat.service';
import { Request } from 'express';

@UseGuards(AuthGuard, RolesGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Roles(Role.ONROAD)
  @Get('/get-messages')
  getOldMessages(@Query() dto: GetOldMessagesDto, @Req() req: Request) {
    return this.chatService.getOldMessages(dto, req.user.id);
  }
}
