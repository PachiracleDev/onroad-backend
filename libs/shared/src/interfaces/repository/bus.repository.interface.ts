import { BusEntity } from '@app/shared/entities/bus.entity';
import { BaseInterfaceRepository } from './../../respositories/base/base.interface.repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BusRepositoryInterface
  extends BaseInterfaceRepository<BusEntity> {}
