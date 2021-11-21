import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatsRepository } from './chat.repository';
import { ChatService } from './chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatsRepository])],
  providers: [ChatService],
})
export class ChatModule {}
