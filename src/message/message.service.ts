import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ChatsRepository } from 'chat/chat.repository';
import { AppError, ArrErrorCode } from 'utils/appError';

import { Message } from './message.entity';
import { MessagesRepository } from './message.repository';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessagesRepository) private messageReoisitory: MessagesRepository,
    @InjectRepository(ChatsRepository) private chatRepository: ChatsRepository
  ) {}

  async createMessage(chatId: number, senderId: number, messageTxt: string): Promise<Message> {
    const chat = await this.chatRepository.findOne(chatId);

    if (!chat) {
      throw new AppError(ArrErrorCode.no_entity_found);
    }

    const message = this.messageReoisitory.create({
      chat,
      message: messageTxt,
      senderId,
    });

    return this.messageReoisitory.save(message);
  }
}
