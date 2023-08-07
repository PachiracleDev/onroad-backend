import { firstValueFrom } from 'rxjs';
import { ConversationRepositoryInterface } from '@app/shared/interfaces/repository/conversation.repository.interface';
import { MessageRepositoryInterface } from '@app/shared/interfaces/repository/message.repository.interface';
import { Injectable, Inject } from '@nestjs/common';
import { ChatServiceInterface } from './interfaces/chat.service.interface';
import { ConversationEntity } from '@app/shared/entities/conversation.entity';
import { MessageEntity } from '@app/shared/entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { ClientProxy } from '@nestjs/microservices';
import { UserEntity } from '@app/shared/entities/user.entity';
import { GetOldMessagesDto } from './dto/get-old-messages.dto';
import { LessThan } from 'typeorm';

@Injectable()
export class ChatService implements ChatServiceInterface {
  constructor(
    @Inject('MessageRepositoryInterface')
    private readonly messageRepository: MessageRepositoryInterface,
    @Inject('ConversationRepositoryInterface')
    private readonly conversationRepository: ConversationRepositoryInterface,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  private async getUser(id: number) {
    const ob$ = this.authService.send<UserEntity>(
      {
        cmd: 'get-user',
      },
      { id },
    );

    const user = await firstValueFrom(ob$).catch((err) => console.error(err));

    return user;
  }

  async createConversation(
    userId: number,
    senderId: number,
  ): Promise<ConversationEntity> {
    const user = await this.getUser(userId);
    const sender = await this.getUser(senderId);

    if (!user || !sender) return;

    const conversation = await this.conversationRepository.findConversation(
      userId,
      senderId,
    );

    if (conversation) {
      return conversation;
    }

    return await this.conversationRepository.save({
      users: [user, sender] as any,
    });
  }

  async createMessage(
    dto: CreateMessageDto,
    userId: number,
  ): Promise<MessageEntity> {
    const conversation = await this.conversationRepository.findByCondition({
      where: {
        id: dto.conversationId,
      },
      relations: ['users'],
    });

    if (!conversation) return;

    return await this.messageRepository.save({
      message: dto.message,
      conversation,
      user: userId as any,
    });
  }

  async getOldMessages(dto: GetOldMessagesDto, userId: number) {
    const messages = await this.messageRepository.findAll({
      where: {
        conversation: {
          id: +dto.conversationId,
        },
        ...(dto.lastId !== 'undefined' && {
          id: LessThan(+dto.lastId),
        }),
      },
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });

    return messages.reverse().map((m) => ({
      conversationId: dto.conversationId,
      createdAt: m.createdAt,
      message: m.message,
      id: m.id,
      me: m.user.id === userId,
    }));
  }

  async getConversations(userId: number): Promise<any[]> {
    const result = await this.conversationRepository.getConversations();

    return result
      .filter((conv) => conv.users.map((u) => u.id).includes(userId))
      .map((conv) => ({
        id: conv.id,
        userIds: conv.users
          .filter((conv) => conv.id !== userId)
          .map((user) => ({
            id: user.id,
            name: user.name,
          })),
        lastUpdated: conv.lastUpdated,
      }));
  }
}
