import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ItineraryServiceInterface } from '../interfaces/itineraries.service.interface';
import { ItineraryEntity } from '@app/shared/entities/itineraries.entity';
import { FindAllItinerariesDto } from '../dto/find-all-itineraries.dto';
import { CreateItinerarieDto } from '../dto/create-itinerarie.dto';
import { UpdateItinerarieDto } from '../dto/update-itinerarie.dto';
import { ItinerariesRepositoryInterface } from '@app/shared/interfaces/repository/itineraries.repository.interface';
import { BusServiceInterface } from '../interfaces/bus.service.interface';
import { RpcException } from '@nestjs/microservices';
//import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

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
      seats: bus.seats.map((s) => ({
        ...s,
        occupied: false,
      })),
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
    // const now = new Date();
    const itineraries = await this.itinerariesRepository.findAll({
      where: {
        origin: dto?.origin,
        destination: dto?.destination,
        //? Esto para que solo muestre los itineararies disponibles, pero lo comente por motivos de desarrollo
        // closingTime: MoreThanOrEqual<Date>(now),
        // openingTime: LessThanOrEqual<Date>(now),
      },
      relations: ['bus'],
    });

    return itineraries.map((itinerary) => ({
      ...itinerary,
      bus: {
        imageUrl: itinerary.bus.imageUrl,
        porcentageIncreaseSeatType: itinerary.bus.porcentageIncreaseSeatType,
      },
    })) as ItineraryEntity[];
  }

  async occupySeats(
    seatsNumber: number[],
    itineraryId: number,
  ): Promise<ItineraryEntity> {
    const itinerary = await this.itinerariesRepository.findOneById(itineraryId);
    if (!itinerary) {
      throw new RpcException('Itinerario no encontrado');
    }

    const seats = itinerary.seats.map((seat) => {
      if (seatsNumber.includes(seat.number)) {
        seat.occupied = true;
      }
      return seat;
    });

    return await this.itinerariesRepository.update(itineraryId, { seats });
  }

  async getItinerary(id: number): Promise<ItineraryEntity> {
    const result = await this.itinerariesRepository.findByCondition({
      where: { id },
      relations: ['bus'],
    });
    if (!result) {
      throw new RpcException('Itinerario no encontrado');
    }
    return result;
  }
}
