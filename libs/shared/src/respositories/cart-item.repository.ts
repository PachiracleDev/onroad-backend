import { InjectRepository } from '@nestjs/typeorm';
import { CartItemEntity } from '../entities/cart-item.entity';
import { CartItemRepositoryInterface } from '../interfaces/repository/cart-item.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { Repository } from 'typeorm';

export class CartItemRepository
  extends BaseAbstractRepository<CartItemEntity>
  implements CartItemRepositoryInterface
{
  constructor(
    @InjectRepository(CartItemEntity)
    readonly cartItemRepository: Repository<CartItemEntity>,
  ) {
    super(cartItemRepository);
  }
}
