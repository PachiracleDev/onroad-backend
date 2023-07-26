import {
  Controller,
  Inject,
  Post,
  Get,
  Put,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendMicroserviceMessage } from '@app/shared/utils/send-message-microservice';
import { CreateItinerarieDto } from 'apps/itineraries/src/dto/create-itinerarie.dto';
import { UpdateItinerarieDto } from 'apps/itineraries/src/dto/update-itinerarie.dto';
import { FindAllItinerariesDto } from 'apps/itineraries/src/dto/find-all-itineraries.dto';
import { Roles } from 'apps/auth/src/decorators/roles.decorator';
import { Role } from '@app/shared/enums/role.enum';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { RolesGuard } from 'apps/auth/src/guards/roles.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Itineraries')
@Controller('itineraries')
export class ItinerariesController {
  constructor(
    @Inject('ITINERARIES_SERVICE') private itinerariesService: ClientProxy,
  ) {}

  @Post('/create')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new itinerary',
    description: 'Create a new itinerary',
  })
  @Roles(Role.ONROAD)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() createItineraryDto: CreateItinerarieDto) {
    return sendMicroserviceMessage(
      this.itinerariesService,
      'create-itinerary',
      createItineraryDto,
    );
  }

  @Put('/update')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an existing itinerary',
    description: 'Update an existing itinerary',
  })
  @Roles(Role.ONROAD)
  @UseGuards(AuthGuard, RolesGuard)
  async update(@Body() updateItineraryDto: UpdateItinerarieDto) {
    return sendMicroserviceMessage(
      this.itinerariesService,
      'update-itinerary',
      updateItineraryDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Find all itineraries',
    description: 'Find all itineraries',
  })
  async findAll(@Query() findAllDto: FindAllItinerariesDto) {
    return sendMicroserviceMessage(
      this.itinerariesService,
      'get-itineraries',
      findAllDto,
    );
  }
}
