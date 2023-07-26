import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string' })
  carPlate: string;

  @IsString()
  @ApiProperty({ required: true, type: 'string' })
  @IsNotEmpty()
  imageUrl: string;

  @IsNumber()
  @ApiProperty({ required: true, type: 'number' })
  @IsNotEmpty()
  operator: number;
}
