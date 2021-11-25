import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private loger = new Logger('EventsGateway');

  afterInit(server: Server) {
    // console.log('web socket listener is up');
    this.loger.log('EventsGateway is running');
    console.log(server);
  }

  handleDisconnect(client: any) {
    console.log('disconnected');
  }
  handleConnection(client: any, ...args: any[]) {
    console.log('connected');
  }

  //Events
  @SubscribeMessage('message')
  handleMessage(socket: Socket, payload: string) {
    console.log('message');
  }
}
