import { BusEntity } from '@app/shared/entities/bus.entity';
import { CreateBusDto } from '../dto/create-bus.dto';
import { UpdateBusDto } from '../dto/update-bus.dto';

export interface BusServiceInterface {
  createBus(dto: CreateBusDto): Promise<BusEntity>;
  updateBus(dto: UpdateBusDto): Promise<BusEntity>;
  getBus(id: number): Promise<BusEntity>;
}
