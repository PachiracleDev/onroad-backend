import { Role } from '@app/shared/enums/role.enum';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { sendMicroserviceMessage } from '@app/shared/utils/send-message-microservice';
import {
  Controller,
  Inject,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Roles } from 'apps/auth/src/decorators/roles.decorator';
import { RolesGuard } from 'apps/auth/src/guards/roles.guard';
import { CreateOperatorDto } from 'apps/itineraries/src/dto/create-operator.dto';
import { UpdateOperatorDto } from 'apps/itineraries/src/dto/update-operator.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Operators')
@ApiBearerAuth()
@Controller('operators')
@Roles(Role.ONROAD)
@UseGuards(AuthGuard, RolesGuard)
export class OperatorsController {
  constructor(
    @Inject('ITINERARIES_SERVICE') private itinerariesService: ClientProxy,
  ) {}

  @Post('/create')
  @ApiOperation({
    summary: 'Create a new operator',
    description:
      'This endpoint is used to create a new operator. Only users with the role ONROAD can access this endpoint.',
  })
  @Post('/create')
  async create(@Body() createOperatorDto: CreateOperatorDto) {
    return sendMicroserviceMessage(
      this.itinerariesService,
      'createOperator',
      createOperatorDto,
    );
  }

  @Post('/update')
  @ApiOperation({
    summary: 'Update an operator',
    description:
      'This endpoint is used to update an operator. Only users with the role ONROAD can access this endpoint.',
  })
  async update(@Body() updateOperatorDto: UpdateOperatorDto) {
    return sendMicroserviceMessage(
      this.itinerariesService,
      'updateOperator',
      updateOperatorDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all operators',
    description:
      'This endpoint is used to get all operators. Only users with the role ONROAD can access this endpoint.',
  })
  async getAll() {
    return sendMicroserviceMessage(
      this.itinerariesService,
      'getAllOperators',
      {},
    );
  }

  @Delete('/delete/:id')
  @ApiOperation({
    summary: 'Delete an operator',
    description:
      'This endpoint is used to delete an operator. Only users with the role ONROAD can access this endpoint.',
  })
  async delete(@Param('id') id: number) {
    return sendMicroserviceMessage(
      this.itinerariesService,
      'deleteOperator',
      id,
    );
  }
}
