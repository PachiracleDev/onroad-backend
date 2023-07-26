import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOperatorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string' })
  name: string;

  @IsPhoneNumber('PE')
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string' })
  phone: string;
}
