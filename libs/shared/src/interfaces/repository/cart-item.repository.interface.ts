import { CartItemEntity } from '@app/shared/entities/cart-item.entity';
import { BaseInterfaceRepository } from '@app/shared/respositories/base/base.interface.repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CartItemRepositoryInterface
  extends BaseInterfaceRepository<CartItemEntity> {}
