import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { SharedServiceInterface } from '@app/shared/interfaces/services/shared.service.interface';

import { BusServiceInterface } from '../interfaces/bus.service.interface';
import { CreateBusDto } from '../dto/create-bus.dto';
import { BusEntity } from '@app/shared/entities/bus.entity';
import { UpdateBusDto } from '../dto/update-bus.dto';
@Controller()
export class BusController {
  constructor(
    @Inject('BusServiceInterface')
    private busService: BusServiceInterface,
    @Inject('SharedServiceInterface')
    private sharedService: SharedServiceInterface,
  ) {}

  @MessagePattern({ cmd: 'createBus' })
  async createOperator(
    @Ctx() ctx: RmqContext,
    @Payload() dto: CreateBusDto,
  ): Promise<BusEntity> {
    this.sharedService.acknowledgeMessage(ctx);

    return this.busService.createBus(dto);
  }

  @MessagePattern({ cmd: 'getAllBuses' })
  async getAllBuses(@Ctx() ctx: RmqContext): Promise<BusEntity[]> {
    this.sharedService.acknowledgeMessage(ctx);
    return this.busService.getAllBuses();
  }

  @MessagePattern({ cmd: 'updateBus' })
  async updateBus(
    @Ctx() ctx: RmqContext,
    @Payload() dto: UpdateBusDto,
  ): Promise<BusEntity> {
    this.sharedService.acknowledgeMessage(ctx);
    return this.busService.updateBus(dto);
  }

  @MessagePattern({ cmd: 'getBus' })
  async getBus(
    @Ctx() ctx: RmqContext,
    @Payload() payload: { id: number },
  ): Promise<BusEntity> {
    this.sharedService.acknowledgeMessage(ctx);
    return this.busService.getBus(payload.id);
  }
}
