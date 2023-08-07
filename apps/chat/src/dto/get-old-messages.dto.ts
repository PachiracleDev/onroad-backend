import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetOldMessagesDto {
  @IsNumber()
  @IsNotEmpty()
  conversationId: string;

  @IsOptional()
  @IsNumber()
  lastId: string;
}
