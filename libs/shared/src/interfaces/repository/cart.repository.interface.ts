import { CartEntity } from '@app/shared/entities/cart.entity';
import { BaseInterfaceRepository } from './../../respositories/base/base.interface.repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CartRepositoryInterface
  extends BaseInterfaceRepository<CartEntity> {}
