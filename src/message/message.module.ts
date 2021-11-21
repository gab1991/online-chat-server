import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatsRepository } from 'chat/chat.repository';

import { MessagesRepository } from './message.repository';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MessagesRepository, ChatsRepository])],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
