import { Injectable, Inject } from '@nestjs/common';
import { BusServiceInterface } from '../interfaces/bus.service.interface';
import { BusRepositoryInterface } from '@app/shared/interfaces/repository/bus.repository.interface';
import { BusEntity } from '@app/shared/entities/bus.entity';
import { CreateBusDto } from '../dto/create-bus.dto';
import { UpdateBusDto } from '../dto/update-bus.dto';
import { OperatorServiceInterface } from '../interfaces/operators.service.interface';
import { RpcException } from '@nestjs/microservices';
@Injectable()
export class BusService implements BusServiceInterface {
  constructor(
    @Inject('BusRepositoryInterface')
    private busRepository: BusRepositoryInterface,
    @Inject('OperatorServiceInterface')
    private operatorService: OperatorServiceInterface,
  ) {}

  async createBus(dto: CreateBusDto): Promise<BusEntity> {
    const operator = await this.operatorService.getOperator(dto.operator);
    if (!operator) {
      throw new RpcException('Operator not found');
    }

    return this.busRepository.save({ ...dto, operator });
  }

  async getAllBuses(): Promise<BusEntity[]> {
    return await this.busRepository.findAll({
      relations: ['operator'],
    });
  }

  async updateBus(dto: UpdateBusDto): Promise<BusEntity> {
    const bus = await this.busRepository.findOneById(dto.id);
    if (!bus) {
      throw new RpcException('Bus no encontrado');
    }
    return await this.busRepository.update(dto.id, dto);
  }

  async getBus(id: number): Promise<BusEntity> {
    const result = await this.busRepository.findOneById(id);
    if (!result) {
      throw new RpcException('Bus no encontrado');
    }
    return result;
  }
}
