import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SeatType } from '@app/shared/enums/seat-type.enum';
export class Seat {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true, type: 'number' })
  number: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, type: 'string' })
  type: SeatType;
}
export class CreateBusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string' })
  carPlate: string;

  @IsString()
  @ApiProperty({ required: true, type: 'string' })
  @IsNotEmpty()
  imageUrl: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(20)
  @ArrayMaxSize(35)
  @ApiProperty({ required: true, type: 'array' })
  seats: Seat[];

  @IsNumber()
  @ApiProperty({ required: true, type: 'number' })
  @IsNotEmpty()
  operator: number;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'jsonb' })
  porcentageIncreaseSeatType: Record<string, number>;
}
