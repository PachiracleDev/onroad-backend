import { MessageEntity } from '@app/shared/entities/message.entity';
import { CreateMessageDto } from '../dto/create-message.dto';
import { ConversationEntity } from '@app/shared/entities/conversation.entity';

export interface ChatServiceInterface {
  createMessage(dto: CreateMessageDto, userId: number): Promise<MessageEntity>;
  createConversation(
    userId: number,
    senderId: number,
  ): Promise<ConversationEntity>;
  getConversations(userId: number): Promise<ConversationEntity[]>;
}
