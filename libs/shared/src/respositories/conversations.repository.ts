import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from '../entities/conversation.entity';
import { ConversationRepositoryInterface } from '../interfaces/repository/conversation.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationRepository
  extends BaseAbstractRepository<ConversationEntity>
  implements ConversationRepositoryInterface
{
  constructor(
    @InjectRepository(ConversationEntity)
    readonly conversationRepository: Repository<ConversationEntity>,
  ) {
    super(conversationRepository);
  }

  async getConversations(userId: number): Promise<ConversationEntity[]> {
    return await this.conversationRepository
      .createQueryBuilder('conversations')
      .leftJoinAndSelect('conversations.users', 'users')
      .where('users.id <> :userId', { userId })
      .orderBy('conversations.lastUpdated', 'DESC')
      .getMany();
  }

  async findConversation(userId: number, senderId) {
    return await this.conversationRepository
      .createQueryBuilder('conversations')
      .leftJoin('conversations.users', 'user')
      .where('user.id = :userId', { userId })
      .orWhere('user.id = :senderId', { senderId })
      .groupBy('conversations.id')
      .having('COUNT(*) > 1')
      .getOne();
  }
}
