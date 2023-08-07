import { SharedServiceInterface } from '@app/shared/interfaces/services/shared.service.interface';
import { Controller, Inject } from '@nestjs/common';
import { OperatorServiceInterface } from '../interfaces/operators.service.interface';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateOperatorDto } from '../dto/create-operator.dto';
import { OperatorEntity } from '@app/shared/entities/operator.entity';
import { UpdateOperatorDto } from '../dto/update-operator.dto';
@Controller()
export class OperatorsController {
  constructor(
    @Inject('SharedServiceInterface')
    private sharedService: SharedServiceInterface,
    @Inject('OperatorServiceInterface')
    private operatorService: OperatorServiceInterface,
  ) {}

  @MessagePattern({ cmd: 'createOperator' })
  async createOperator(
    @Payload() dto: CreateOperatorDto,
    @Ctx() ctx: RmqContext,
  ): Promise<OperatorEntity> {
    this.sharedService.acknowledgeMessage(ctx);
    return await this.operatorService.createOperator(dto);
  }

  @MessagePattern({ cmd: 'updateOperator' })
  async updateOperator(
    @Payload() dto: UpdateOperatorDto,
    @Ctx() ctx: RmqContext,
  ): Promise<OperatorEntity> {
    this.sharedService.acknowledgeMessage(ctx);
    return await this.operatorService.updateOperator(dto);
  }

  @MessagePattern({ cmd: 'deleteOperator' })
  async deleteOperator(
    @Payload() payload: { id: number },
    @Ctx() ctx: RmqContext,
  ): Promise<OperatorEntity> {
    this.sharedService.acknowledgeMessage(ctx);
    return await this.operatorService.deleteOperator(payload.id);
  }

  @MessagePattern({ cmd: 'getAllOperators' })
  async getAllOperators(@Ctx() ctx: RmqContext): Promise<OperatorEntity[]> {
    this.sharedService.acknowledgeMessage(ctx);
    return await this.operatorService.getAllOperators();
  }

  @MessagePattern({ cmd: 'getOperator' })
  async getOperator(
    @Payload() payload: { id: number },
    @Ctx() ctx: RmqContext,
  ): Promise<OperatorEntity> {
    this.sharedService.acknowledgeMessage(ctx);
    return await this.operatorService.getOperator(payload.id);
  }
}
