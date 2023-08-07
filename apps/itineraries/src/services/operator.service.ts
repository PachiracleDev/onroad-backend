import { Injectable, Inject } from '@nestjs/common';
import { OperatorServiceInterface } from '../interfaces/operators.service.interface';
import { OperatorRepositoryInterface } from '@app/shared/interfaces/repository/operator.repository.interface';
import { OperatorEntity } from '@app/shared/entities/operator.entity';
import { CreateOperatorDto } from '../dto/create-operator.dto';
import { UpdateOperatorDto } from '../dto/update-operator.dto';
import { RpcException } from '@nestjs/microservices';
@Injectable()
export class OperatorService implements OperatorServiceInterface {
  constructor(
    @Inject('OperatorRepositoryInterface')
    private operatorRepository: OperatorRepositoryInterface,
  ) {}

  async createOperator(dto: CreateOperatorDto): Promise<OperatorEntity> {
    return this.operatorRepository.save(dto);
  }

  async deleteOperator(id: number): Promise<OperatorEntity> {
    const operator = await this.operatorRepository.findOneById(id);
    if (!operator) {
      throw new RpcException('No se encontró el operador');
    }
    return this.operatorRepository.remove(operator);
  }

  async updateOperator(dto: UpdateOperatorDto): Promise<OperatorEntity> {
    const operator = await this.operatorRepository.findOneById(dto.id);
    if (!operator) {
      throw new RpcException('No se encontró el operador');
    }
    return this.operatorRepository.save(dto);
  }

  async getOperator(id: number): Promise<OperatorEntity> {
    return this.operatorRepository.findOneById(id);
  }

  async getAllOperators(): Promise<OperatorEntity[]> {
    return this.operatorRepository.findAll();
  }
}
