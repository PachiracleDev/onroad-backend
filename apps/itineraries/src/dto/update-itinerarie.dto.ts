import { PartialType } from '@nestjs/mapped-types';
import { CreateItinerarieDto } from './create-itinerarie.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateItinerarieDto extends PartialType(CreateItinerarieDto) {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'number' })
  id: number;
}
