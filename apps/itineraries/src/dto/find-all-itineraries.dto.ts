import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllItinerariesDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, type: 'string' })
  origin: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, type: 'string' })
  destination: string;
}
