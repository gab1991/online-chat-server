import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { isProd } from 'main';
import { Server, Socket } from 'socket.io';

import { ProfileRepository } from 'modules/profile/profile.repository';

import { OnlineService } from './online.service';

@WebSocketGateway({ cors: !isProd && true, namespace: '/chats' })
export class ChatsWebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private profilesRepository: ProfileRepository, private onlineService: OnlineService) {}

  handleDisconnect(socket: Socket): void {
    this.onlineService.setOffline(socket.id);
  }

  handleConnection(socket: Socket): void {
    this.onlineService.onConnection(socket.id);
  }

  //Events
  @SubscribeMessage('subscribeToChats')
  async handleMessage(socket: Socket, profileId: number): Promise<void> {
    const profile = await this.profilesRepository.findOneOrFail(profileId, { relations: ['chats'] });

    profile.chats.forEach((chat) => {
      socket.join(`${chat.id}`);
    });
  }

  @SubscribeMessage('setIsOnlineToServer')
  setIsOnline(socket: Socket, profileId: number): WsResponse<number> {
    this.onlineService.setOnline(socket.id, profileId);

    return { event: 'setIsOnlineToClient', data: profileId };
  }
}
