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
import { MessageDto } from 'modules/message/dto/message.dto';
import { Message } from 'modules/message/message.entity';
import { MessageService } from 'modules/message/message.service';

@WebSocketGateway({ cors: true })
@UsePipes(new ValidationPipe())
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private messageService: MessageService) {}

  private loger = new Logger('EventsGateway');

  afterInit(): void {
    this.loger.log('EventsGateway is running');
  }

  handleDisconnect(client: any): void {
    // console.log('disconnected');
  }
  handleConnection(client: Socket, ...args: any[]): void {
    console.log('connected', client.id);
  }

  @SubscribeMessage(ServerEvents.joinChats)
  joinChats(socket: Socket, joinChatsDto: JoinChatsDto): void {
    const chatTextIds = joinChatsDto.chatIds.map((id) => id.toString());

    socket.join(chatTextIds);

    console.log('all rooms', this.server.sockets.adapter.rooms);
  }

  //Events
  @SubscribeMessage(ServerEvents.sendMessageToServer)
  @Serialize(MessageDto)
  async handleMessageSending(socket: Socket, sendMessageDto: SendMessageToServerDto): Promise<void> {
    const { chatId, message, senderId } = sendMessageDto;
    const savedMsg = await this.messageService.createMessage(chatId, senderId, message);

    // this.server.sockets.
    this.server.to(chatId.toString()).emit(ClientEvents.sendMessageToClient, savedMsg);
  }
}
