import { OperatorEntity } from '@app/shared/entities/operator.entity';
import { CreateOperatorDto } from '../dto/create-operator.dto';
import { UpdateOperatorDto } from '../dto/update-operator.dto';

export interface OperatorServiceInterface {
  createOperator(dto: CreateOperatorDto): Promise<OperatorEntity>;
  updateOperator(dto: UpdateOperatorDto): Promise<OperatorEntity>;
  deleteOperator(id: number): Promise<OperatorEntity>;
  getOperator(id: number): Promise<OperatorEntity>;
  getAllOperators(): Promise<OperatorEntity[]>;
}
