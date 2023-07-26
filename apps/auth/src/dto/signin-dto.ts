import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true, type: 'string' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({ required: true, type: 'string' })
  password: string;
}
