import { UserEntity } from '../../entities/user.entity';
import { BaseInterfaceRepository } from '../../respositories/base/base.interface.repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {}
