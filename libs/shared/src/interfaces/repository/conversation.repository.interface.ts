import { ConversationEntity } from '../../entities/conversation.entity';
import { BaseInterfaceRepository } from '../../respositories/base/base.interface.repository';

export interface ConversationRepositoryInterface
  extends BaseInterfaceRepository<ConversationEntity> {
  getConversations(userId: number): Promise<ConversationEntity[]>;
  findConversation(
    userId: number,
    senderId: number,
  ): Promise<ConversationEntity>;
}
