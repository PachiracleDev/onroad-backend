import { Controller, Inject, UseGuards } from '@nestjs/common';

import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared/services/shared.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninDto } from './dto/signin-dto';
import { JwtGuard } from './guards/jwt.guard';
import { AuthServiceInterface } from './interfaces/auth.service.interface';

@Controller()
export class AuthController {
  constructor(
    @Inject('AuthServiceInterface')
    private readonly authService: AuthServiceInterface,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'register' })
  async register(@Ctx() ctx: RmqContext, @Payload() dto: CreateUserDto) {
    this.sharedService.acknowledgeMessage(ctx);
    return this.authService.register(dto);
  }

  @MessagePattern({ cmd: 'signin' })
  async signin(@Ctx() ctx: RmqContext, @Payload() dto: SigninDto) {
    this.sharedService.acknowledgeMessage(ctx);
    return this.authService.login(dto);
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  @UseGuards(JwtGuard)
  async verifyJwt(@Ctx() ctx: RmqContext, @Payload() payload: { jwt: string }) {
    this.sharedService.acknowledgeMessage(ctx);
    return this.authService.verifyJwtToken(payload.jwt);
  }

  @MessagePattern({ cmd: 'decode-jwt' })
  async decodeJwt(@Ctx() ctx: RmqContext, @Payload() payload: { jwt: string }) {
    this.sharedService.acknowledgeMessage(ctx);
    return this.authService.decodeJwtToken(payload.jwt);
  }

  @MessagePattern({ cmd: 'get-onroads-team' })
  async getOnroadsTeam(
    @Ctx() ctx: RmqContext,
    @Payload() payload: { userId: number },
  ) {
    this.sharedService.acknowledgeMessage(ctx);
    return this.authService.getOnroadsTeam(payload.userId);
  }

  @MessagePattern({ cmd: 'get-user' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() user: { id: number },
  ) {
    this.sharedService.acknowledgeMessage(context);

    return this.authService.getUserById(user.id);
  }
}
