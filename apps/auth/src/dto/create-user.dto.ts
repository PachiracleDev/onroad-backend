import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, type: 'string' })
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, type: 'string' })
  @MinLength(8)
  password: string;
}
