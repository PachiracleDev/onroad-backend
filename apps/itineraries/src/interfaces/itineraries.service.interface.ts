import { ItineraryEntity } from '@app/shared/entities/itineraries.entity';
import { FindAllItinerariesDto } from '../dto/find-all-itineraries.dto';
import { CreateItinerarieDto } from '../dto/create-itinerarie.dto';
import { UpdateItinerarieDto } from '../dto/update-itinerarie.dto';

export interface ItineraryServiceInterface {
  createItinerary(dto: CreateItinerarieDto): Promise<ItineraryEntity>;
  updateItinerary(dto: UpdateItinerarieDto): Promise<ItineraryEntity>;
  findAllItineraries(dto: FindAllItinerariesDto): Promise<ItineraryEntity[]>;
  getItinerary(id: number): Promise<ItineraryEntity>;
}
