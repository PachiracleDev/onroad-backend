import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Seat } from 'apps/itineraries/src/dto/create-bus.dto';

export class AddItemToCartDto {
  @IsNumber()
  @ApiProperty({ required: true, type: 'number' })
  @IsNotEmpty()
  itemId: number; // Lo hice más genérico, para que se pueda vender cualquier cosa y no solo tickets de itinerarios

  @IsArray()
  @IsNotEmpty()
  seats: Seat[];

  // Por rendimiento podria haberse mandado el cartId,
  // pero es más seguro usar el userId del token, para que no se pueda modificar el cartId de otro usuario
}
