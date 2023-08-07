import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItinerarieDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ required: true, type: 'string' })
  closingTime: Date;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ required: true, type: 'string' })
  openingTime: Date;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true, type: 'number' })
  baseTicketPrice: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, type: 'string' })
  origin: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, type: 'string' })
  destination: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true, type: 'number' })
  bus: number;
}
