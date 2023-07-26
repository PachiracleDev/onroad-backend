import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RemoveItemToCartDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'number' })
  itemId: number;
}
