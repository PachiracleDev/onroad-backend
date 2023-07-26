import { ItineraryEntity } from '@app/shared/entities/itineraries.entity';
import { BaseInterfaceRepository } from '@app/shared/respositories/base/base.interface.repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ItinerariesRepositoryInterface
  extends BaseInterfaceRepository<ItineraryEntity> {}
