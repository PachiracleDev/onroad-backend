import { SeatType } from '@app/shared/enums/seat-type.enum';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemToCartDto {
  @IsNumber()
  @ApiProperty({ required: true, type: 'number' })
  @IsNotEmpty()
  itemId: number; // Lo hice más genérico, para que se pueda vender cualquier cosa y no solo tickets de itinerarios

  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'number' })
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @ApiProperty({ required: true, enum: SeatType })
  @IsEnum(SeatType)
  seatType: SeatType;

  // Por rendimiento podria haberse mandado el cartId,
  // pero es más seguro usar el userId del token, para que no se pueda modificar el cartId de otro usuario
}
