import { sendMicroserviceMessage } from '@app/shared/utils/send-message-microservice';
import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/auth/src/dto/create-user.dto';
import { SigninDto } from 'apps/auth/src/dto/signin-dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { Request } from 'express';
import { AuthGuard } from '@app/shared/guards/auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Post('/register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'This endpoint is used to register a new user',
  })
  async register(@Body() dto: CreateUserDto) {
    return sendMicroserviceMessage(this.authService, 'register', dto);
  }

  @Post('/signin')
  @ApiOperation({
    summary: 'Signin a user',
    description: 'This endpoint is used to signin a user',
  })
  async signin(@Body() dto: SigninDto) {
    return sendMicroserviceMessage(this.authService, 'signin', dto);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get user profile',
    description: 'This endpoint is used to get user profile',
  })
  async profile(@Req() req: Request) {
    return sendMicroserviceMessage(this.authService, 'profile', {
      id: req.user.id,
    });
  }
}
