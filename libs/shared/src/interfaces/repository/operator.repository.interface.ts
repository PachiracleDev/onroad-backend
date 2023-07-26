import { OperatorEntity } from '@app/shared/entities/operator.entity';
import { BaseInterfaceRepository } from '@app/shared/respositories/base/base.interface.repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OperatorRepositoryInterface
  extends BaseInterfaceRepository<OperatorEntity> {}
