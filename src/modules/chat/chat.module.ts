import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileRepository } from 'modules/profile/profile.repository';

import { ChatController } from './chat.controller';
import { ChatsWebsocketGateway } from './chat.gateway';
import { ChatsRepository } from './chat.repository';
import { ChatService } from './chat.service';
import { OnlineService } from './online.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatsRepository, ProfileRepository])],
  providers: [ChatService, ChatsWebsocketGateway, OnlineService],
  controllers: [ChatController],
})
export class ChatModule {}
