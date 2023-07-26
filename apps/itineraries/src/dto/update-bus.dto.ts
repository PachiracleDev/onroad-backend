import { PartialType } from '@nestjs/mapped-types';
import { CreateBusDto } from './create-bus.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBusDto extends PartialType(CreateBusDto) {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'number' })
  id: number;
}
