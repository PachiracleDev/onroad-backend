import { Seat } from 'apps/itineraries/src/dto/create-bus.dto';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class ItemCart {
  @IsNumber()
  @IsNotEmpty()
  itinerarieId: number;

  @IsArray()
  @IsNotEmpty()
  seats: Seat[];
}

export class CreatePaymentIntent {
  @IsArray()
  @IsNotEmpty()
  items: ItemCart[];
}
