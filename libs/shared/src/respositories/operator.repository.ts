import { InjectRepository } from '@nestjs/typeorm';
import { OperatorEntity } from '../entities/operator.entity';
import { OperatorRepositoryInterface } from '../interfaces/repository/operator.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { Repository } from 'typeorm';

export class OperatorRepository
  extends BaseAbstractRepository<OperatorEntity>
  implements OperatorRepositoryInterface
{
  constructor(
    @InjectRepository(OperatorEntity)
    readonly operatorRepository: Repository<OperatorEntity>,
  ) {
    super(operatorRepository);
  }
}
