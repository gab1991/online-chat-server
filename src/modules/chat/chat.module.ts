import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileRepository } from 'modules/profile/profile.repository';

import { ChatController } from './chat.controller';
import { ChatsRepository } from './chat.repository';
import { ChatService } from './chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatsRepository, ProfileRepository])],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
