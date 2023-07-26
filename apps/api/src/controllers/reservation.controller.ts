import { Controller, Inject, Post, UseGuards, Req, Get } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendMicroserviceMessage } from '@app/shared/utils/send-message-microservice';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { Request } from 'express';
import { RolesGuard } from 'apps/auth/src/guards/roles.guard';
import { Roles } from 'apps/auth/src/decorators/roles.decorator';
import { Role } from '@app/shared/enums/role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationController {
  constructor(
    @Inject('RESERVATIONS_SERVICE')
    private readonly reservationsService: ClientProxy,
  ) {}

  @Post('/create')
  @ApiOperation({
    summary: 'Create a new reservation',
    description:
      'This endpoint is used to create a new reservation. Only authenticated users can access this endpoint.',
  })
  @UseGuards(AuthGuard)
  create(@Req() req: Request) {
    return sendMicroserviceMessage(
      this.reservationsService,
      'create-reservation',
      {
        userId: req.user.id,
      },
    );
  }

  @Get('/get-my-reservations')
  @ApiOperation({
    summary: 'Get my reservations',
    description:
      'This endpoint is used to get my reservations. Only authenticated users can access this endpoint.',
  })
  @UseGuards(AuthGuard)
  getMyReservations(@Req() req: Request) {
    return sendMicroserviceMessage(
      this.reservationsService,
      'get-my-reservations',
      {
        userId: req.user.id,
      },
    );
  }

  @Get('/get-all-reservations')
  @ApiOperation({
    summary: 'Get all reservations',
    description:
      'This endpoint is used to get all reservations. Only authenticated users can access this endpoint.',
  })
  @Roles(Role.ONROAD)
  @UseGuards(AuthGuard, RolesGuard)
  getAllReservations() {
    return sendMicroserviceMessage(
      this.reservationsService,
      'get-all-reservations',
      {},
    );
  }
}
