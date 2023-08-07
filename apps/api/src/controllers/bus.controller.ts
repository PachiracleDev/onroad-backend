import {
  Controller,
  Inject,
  Patch,
  Post,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateBusDto } from 'apps/itineraries/src/dto/create-bus.dto';
import { UpdateBusDto } from 'apps/itineraries/src/dto/update-bus.dto';
import { sendMicroserviceMessage } from '@app/shared/utils/send-message-microservice';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { RolesGuard } from 'apps/auth/src/guards/roles.guard';
import { Roles } from 'apps/auth/src/decorators/roles.decorator';
import { Role } from '@app/shared/enums/role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Bus')
@ApiBearerAuth()
@Controller('bus')
@Roles(Role.ONROAD)
@UseGuards(AuthGuard, RolesGuard)
export class BusController {
  constructor(
    @Inject('ITINERARIES_SERVICE') private itinerariesService: ClientProxy,
  ) {}

  @Post('/create')
  @ApiOperation({
    summary: 'Create a new bus',
    description:
      'This endpoint is used to create a new bus. Only users with the role ONROAD can access this endpoint.',
  })
  async create(@Body() createBusDto: CreateBusDto) {
    return sendMicroserviceMessage(
      this.itinerariesService,
      'createBus',
      createBusDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all buses',
    description:
      'This endpoint is used to get all buses. Only users with the role ONROAD can access this endpoint.',
  })
  async getAll() {
    return sendMicroserviceMessage(this.itinerariesService, 'getAllBuses', {});
  }

  @Patch('/update')
  @Post('/create')
  @ApiOperation({
    summary: 'Update a bus',
    description:
      'This endpoint is used to update a bus. Only users with the role ONROAD can access this endpoint.',
  })
  async update(@Body() updateBusDto: UpdateBusDto) {
    return sendMicroserviceMessage(
      this.itinerariesService,
      'updateBus',
      updateBusDto,
    );
  }
}
