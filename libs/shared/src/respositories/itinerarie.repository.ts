import { InjectRepository } from '@nestjs/typeorm';
import { ItineraryEntity } from '../entities/itineraries.entity';
import { ItinerariesRepositoryInterface } from '../interfaces/repository/itineraries.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { Repository } from 'typeorm';

export class ItinerarieRepository
  extends BaseAbstractRepository<ItineraryEntity>
  implements ItinerariesRepositoryInterface
{
  constructor(
    @InjectRepository(ItineraryEntity)
    readonly itinerarieRepository: Repository<ItineraryEntity>,
  ) {
    super(itinerarieRepository);
  }
}
