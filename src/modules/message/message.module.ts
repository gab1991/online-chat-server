import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from 'modules';

import { ChatsRepository } from 'modules/chat/chat.repository';

import { MessageController } from './message.controller';
import { MessagesRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessagesRepository, ChatsRepository]),
    forwardRef(() => ProfileModule),
  ],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
