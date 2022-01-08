import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Serialize } from 'decorators';
import { Server, Socket } from 'socket.io';

import { ClientEvents, ServerEvents } from './types';

import { JoinChatsDto } from './dto/joinChats.dto';
import { SendMessageToServerDto } from './dto/sendMessageToServer.dto';
import { SetIsOnlineDto } from './dto/setIsOnline.dto';
import { ChatService } from 'modules/chat/chat.service';
import { MessageDto } from 'modules/message/dto/message.dto';
import { MessageService } from 'modules/message/message.service';

import { OnlineService } from './online.service';

@WebSocketGateway({ cors: { origin: ['http://localhost:3000'], credentials: true } })
@UsePipes(new ValidationPipe())
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private messageService: MessageService,
    private onlineService: OnlineService,
    private chatService: ChatService
  ) {}

  private loger = new Logger('EventsGateway');

  afterInit(): void {
    this.loger.log('EventsGateway is running');
  }

  handleDisconnect(socket: Socket): void {
    this.onlineService.setOffline(socket.id);
    console.log(this.onlineService.getAllLists());
  }

  handleConnection(socket: Socket): void {
    console.log('connected', socket.id);
  }

  @SubscribeMessage(ServerEvents.joinChats)
  joinChats(socket: Socket, joinChatsDto: JoinChatsDto): void {
    const chatTextIds = joinChatsDto.chatIds.map((id) => id.toString());

    socket.join(chatTextIds);
  }

  //Events
  @SubscribeMessage(ServerEvents.sendMessageToServer)
  @Serialize(MessageDto)
  async handleMessageSending(
    socket: Socket,
    sendMessageDto: SendMessageToServerDto
  ): Promise<void> {
    const { chatId, message, senderId } = sendMessageDto;

    const savedMsg = await this.messageService.createMessage(chatId, senderId, message);
    const chatParticipantsIds = await this.chatService.findChatParticipantIds(chatId);

    const profileToSocketMap = this.onlineService.getReversedActiveSocketMap();

    const usersSockets = chatParticipantsIds.reduce((prev: string[], id) => {
      const onlineSocket = profileToSocketMap[id];

      if (onlineSocket) {
        return [...prev, onlineSocket];
      }

      return prev;
    }, []);

    this.server.to(usersSockets).emit(ClientEvents.sendMessageToClient, savedMsg);
  }

  @SubscribeMessage(ServerEvents.setIsOnline)
  async setIsOnline(socket: Socket, setIsOnlineDto: SetIsOnlineDto): Promise<void> {
    const { profileId } = setIsOnlineDto;
    this.onlineService.setOnline(socket.id, profileId);
    console.log(this.onlineService.getAllLists());
  }
}
