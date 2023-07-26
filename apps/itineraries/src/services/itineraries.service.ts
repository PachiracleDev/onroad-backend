import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ItineraryServiceInterface } from '../interfaces/itineraries.service.interface';
import { ItineraryEntity } from '@app/shared/entities/itineraries.entity';
import { FindAllItinerariesDto } from '../dto/find-all-itineraries.dto';
import { CreateItinerarieDto } from '../dto/create-itinerarie.dto';
import { UpdateItinerarieDto } from '../dto/update-itinerarie.dto';
import { ItinerariesRepositoryInterface } from '@app/shared/interfaces/repository/itineraries.repository.interface';
import { BusServiceInterface } from '../interfaces/bus.service.interface';
import { RpcException } from '@nestjs/microservices';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class ItineratiesService implements ItineraryServiceInterface {
  constructor(
    @Inject('ItinerariesRepositoryInterface')
    private itinerariesRepository: ItinerariesRepositoryInterface,
    @Inject('BusServiceInterface')
    private readonly busService: BusServiceInterface,
  ) {}

  async createItinerary(dto: CreateItinerarieDto): Promise<ItineraryEntity> {
    const bus = await this.busService.getBus(dto.bus);

    return this.itinerariesRepository.save({
      ...dto,
      bus,
      availableSeats: dto.maxCapacity,
    });
  }

  async updateItinerary(dto: UpdateItinerarieDto): Promise<ItineraryEntity> {
    const itinerary = await this.itinerariesRepository.findOneById(dto.id);
    if (!itinerary) {
      throw new NotFoundException();
    }
    return await this.itinerariesRepository.update(dto.id, dto);
  }

  async findAllItineraries(
    dto: FindAllItinerariesDto,
  ): Promise<ItineraryEntity[]> {
    const now = new Date();
    return await this.itinerariesRepository.findAll({
      where: {
        origin: dto?.origin,
        destination: dto?.destination,
        closingTime: MoreThanOrEqual<Date>(now),
        openingTime: LessThanOrEqual<Date>(now),
      },
    });
  }

  async getItinerary(id: number): Promise<ItineraryEntity> {
    const result = await this.itinerariesRepository.findOneById(id);
    if (!result) {
      throw new RpcException('Itinerario no encontrado');
    }
    return result;
  }
}
