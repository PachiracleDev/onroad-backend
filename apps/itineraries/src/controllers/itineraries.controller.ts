import { SharedService } from './../../../../libs/shared/src/services/shared.service';

import { Controller, Inject } from '@nestjs/common';
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateItinerarieDto } from '../dto/create-itinerarie.dto';
import { UpdateItinerarieDto } from '../dto/update-itinerarie.dto';
import { FindAllItinerariesDto } from '../dto/find-all-itineraries.dto';
import { ItineraryServiceInterface } from '../interfaces/itineraries.service.interface';

@Controller()
export class ItineratiesController {
  constructor(
    @Inject('ItineraryServiceInterface')
    private readonly itineratiesService: ItineraryServiceInterface,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'create-itinerary' })
  async createItinerary(@Ctx() ctx, @Payload() dto: CreateItinerarieDto) {
    this.sharedService.acknowledgeMessage(ctx);

    return this.itineratiesService.createItinerary(dto);
  }

  @MessagePattern({ cmd: 'update-itinerary' })
  async updateItinerary(@Ctx() ctx, @Payload() dto: UpdateItinerarieDto) {
    this.sharedService.acknowledgeMessage(ctx);

    return this.itineratiesService.updateItinerary(dto);
  }

  @MessagePattern({ cmd: 'get-itinerary' })
  async getItinerary(@Ctx() ctx, @Payload() payload: { id: number }) {
    this.sharedService.acknowledgeMessage(ctx);

    return this.itineratiesService.getItinerary(payload.id);
  }

  @MessagePattern({ cmd: 'get-itineraries' })
  async getItineraries(@Ctx() ctx, @Payload() payload: FindAllItinerariesDto) {
    this.sharedService.acknowledgeMessage(ctx);

    return this.itineratiesService.findAllItineraries(payload);
  }

  @MessagePattern({ cmd: 'occupy-seats' })
  async occupySeats(
    @Ctx() ctx,
    @Payload() payload: { seats: number[]; itineraryId: number },
  ) {
    this.sharedService.acknowledgeMessage(ctx);

    return this.itineratiesService.occupySeats(
      payload.seats,
      payload.itineraryId,
    );
  }
}
