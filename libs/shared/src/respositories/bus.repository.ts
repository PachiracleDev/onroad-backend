import { InjectRepository } from '@nestjs/typeorm';
import { BusEntity } from '../entities/bus.entity';
import { BusRepositoryInterface } from '../interfaces/repository/bus.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { Repository } from 'typeorm';

export class BusRepository
  extends BaseAbstractRepository<BusEntity>
  implements BusRepositoryInterface
{
  constructor(
    @InjectRepository(BusEntity) readonly busRepository: Repository<BusEntity>,
  ) {
    super(busRepository);
  }
}
