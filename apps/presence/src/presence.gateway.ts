import { ClientProxy } from '@nestjs/microservices';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RedisCacheService } from '@app/shared/services/redis-cache.service';
import { firstValueFrom } from 'rxjs';
import { ActiveUser } from './interfaces/active-user.interface';
import { TokenInterface } from 'apps/auth/src/interfaces/token.interface';

@WebSocketGateway({
  cors: true,
})
export class PresenceGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect
{
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    private readonly cache: RedisCacheService,
  ) {}

  @WebSocketServer()
  server: Server;

  async onModuleInit() {
    await this.cache.reset(); // Solo usar esto en modo desarrollo
  }

  private async getOnroadsTeam(userId: number) {
    const observable = this.authService.send(
      { cmd: 'get-onroads-team' },
      { userId },
    );
    return await firstValueFrom(observable).catch((err) => console.error(err));
  }

  private async emitStatusToOnroadsTeam(activeUser: ActiveUser) {
    const onroadsTeam = await this.getOnroadsTeam(activeUser.id);

    for (const onroad of onroadsTeam) {
      const user = (await this.cache.get(`user ${onroad.id}`)) as
        | ActiveUser
        | undefined;
      if (!user) continue;

      this.server.to(user.socketId).emit('onroadActive', {
        id: activeUser.id,
        isActive: activeUser.isActive,
      });

      if (activeUser.isActive) {
        this.server.to(activeUser.socketId).emit('onroadActive', {
          id: onroad.id,
          isActive: user.isActive,
        });
      }
    }
  }

  private async setActiveStatus(socket: Socket, isActive: boolean) {
    const user = socket.data.user;
    if (!user) return;

    const activeUser: ActiveUser = {
      id: user.id,
      socketId: socket.id,
      isActive,
    };

    await this.cache.set(`user ${user.id}`, activeUser);
    await this.emitStatusToOnroadsTeam(activeUser);
  }

  async handleConnection(socket: Socket) {
    const jwt = socket.handshake.headers.authorization.split(' ')[1] ?? null;
    if (!jwt) {
      this.handleDisconnect(socket);
      return;
    }

    const observable = this.authService.send<TokenInterface>(
      { cmd: 'decode-jwt' },
      { jwt },
    );

    const result = await firstValueFrom(observable).catch((err) =>
      console.error(err),
    );

    if (!result || !result?.id) {
      this.handleDisconnect(socket);
      return;
    }

    socket.data.user = result;

    await this.setActiveStatus(socket, true);
  }

  async handleDisconnect(socket: Socket) {
    await this.setActiveStatus(socket, false);
  }

  @SubscribeMessage('updateActiveStatus')
  async updateActiveStatus(socket: Socket, isActive: boolean) {
    if (!socket.data?.user) return;

    await this.setActiveStatus(socket, isActive);
  }
}
