import { RedisCacheService } from '@app/shared/services/redis-cache.service';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { TokenInterface } from 'apps/auth/src/interfaces/token.interface';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Role } from '@app/shared/enums/role.enum';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private readonly presenceService: ClientProxy,
    private readonly cache: RedisCacheService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    const jwt = socket.handshake.headers?.authorization.split(' ')[1] ?? null;

    if (!jwt) {
      this.handleDisconnect(socket);
      return;
    }

    const obeservable = this.authService.send<TokenInterface>(
      { cmd: 'decode-jwt' },
      { jwt },
    );

    const result = await firstValueFrom(obeservable).catch((err) =>
      console.error(err),
    );

    if (!result || !result?.id || result.role !== Role.ONROAD) {
      this.handleDisconnect(socket);
      return;
    }
    socket.data.user = result;

    await this.setConversationUser(socket);
    await this.createConversations(socket);
    await this.getConversations(socket); // Esto es para que el usuario que se conecta pueda ver sus conversaciones anteriores
  }

  private async createConversations(socket: Socket) {
    const userId = socket.data.user.id;
    const observable = this.authService.send(
      { cmd: 'get-onroads-team' },
      { userId },
    );
    const onroadTeam = await firstValueFrom(observable).catch((err) =>
      console.error(err),
    );

    for (const user of onroadTeam) {
      await this.chatService.createConversation(userId, user.id);
    }
  }

  private async setConversationUser(socket: Socket) {
    const user = socket.data.user;
    const conversationUser = {
      id: user.id,
      socketId: socket.id,
    };
    await this.cache.set(`conversation-user-${user.id}`, conversationUser);
  }

  private async getOnroadFriendDetails(id: number) {
    const observable = this.presenceService.send(
      { cmd: 'get-active-user' },
      { id },
    );

    const activeFriend = await firstValueFrom(observable);

    if (!activeFriend) return;

    const friendsDetails = (await this.cache.get(
      `conversation-user-${activeFriend.id}`,
    )) as { id: number; socketId: string } | undefined;

    return friendsDetails;
  }

  @SubscribeMessage('get-conversations')
  async getConversations(socket: Socket) {
    const user = socket.data.user;
    if (!user) return;
    const conversations = await this.chatService.getConversations(user.id);

    this.server.to(socket.id).emit('get-all-conversations', conversations);
  }

  @SubscribeMessage('send-message')
  async sendMessage(socket: Socket, newMessage: CreateMessageDto) {
    if (!newMessage) return;

    const user = socket.data.user;

    if (!user) return;

    const message = JSON.parse(newMessage as any);

    const createdMessage = await this.chatService.createMessage(
      message,
      user.id,
    );

    const friendId = createdMessage.conversation.users.find(
      (f) => f.id !== user.id,
    ).id;

    const friendDetails = await this.getOnroadFriendDetails(friendId);

    if (!friendDetails) return;

    this.server.to(friendDetails.socketId).emit('new-message', {
      id: createdMessage.id,
      message: createdMessage.message,
      createdAt: createdMessage.createdAt,
      creatorId: createdMessage.user.id,
      conversationId: createdMessage.conversation.id,
    });
  }

  handleDisconnect(_: Socket) {
    console.log('disconnect', _.id);
  }
}
