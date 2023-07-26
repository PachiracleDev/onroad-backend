import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from '../entities/cart.entity';
import { CartRepositoryInterface } from '../interfaces/repository/cart.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { Repository } from 'typeorm';

export class CartRepository
  extends BaseAbstractRepository<CartEntity>
  implements CartRepositoryInterface
{
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {
    super(cartRepository);
  }
}
