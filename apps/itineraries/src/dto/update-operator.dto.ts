import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateOperatorDto } from './create-operator.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOperatorDto extends PartialType(CreateOperatorDto) {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'number' })
  id: number;
}
