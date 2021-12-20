import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Serialize } from 'decorators';
import { Server, Socket } from 'socket.io';

import { ClientEvents, ServerEvents } from './types';

import { SendMessageToServerDto } from './dto/sendMessageToServer.dto';
import { MessageDto } from 'modules/message/dto/message.dto';
import { Message } from 'modules/message/message.entity';
import { MessageService } from 'modules/message/message.service';

@WebSocketGateway({ cors: true })
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

  //Events
  @SubscribeMessage(ServerEvents.sendMessageToServer)
  @Serialize(MessageDto)
  async handleMessageSending(socket: Socket, sendMessageDto: SendMessageToServerDto): Promise<WsResponse<Message>> {
    const { chatId, message, senderId } = sendMessageDto;
    const savedMsg = await this.messageService.createMessage(chatId, senderId, message);

    return { event: ClientEvents.sendMessageToClient, data: savedMsg };
  }
}
