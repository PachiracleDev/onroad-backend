import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string' })
  message: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'number' })
  conversationId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'number' })
  senderId: number;
}
