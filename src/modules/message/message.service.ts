import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ChatsRepository } from 'modules/chat/chat.repository';
import { ProfileService } from 'modules/profile/profile.service';
import { AppError, ArrErrorCode } from 'utils/appError';

import { Message } from './message.entity';
import { MessagesRepository } from './message.repository';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessagesRepository) private messageReoisitory: MessagesRepository,
    @InjectRepository(ChatsRepository) private chatRepository: ChatsRepository,
    private profileService: ProfileService
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
      chatId: chat.id,
    });

    return this.messageReoisitory.save(message);
  }

  async findMessages(chatIds: number[], searchStr: string): Promise<Message[]> {
    return this.messageReoisitory.searchMessagesInChats(chatIds, searchStr);
  }

  async findMessageForProfile(profileId: number, searchStr: string): Promise<Message[]> {
    const { chats } = await this.profileService.getProfile(profileId);
    const chatIds = chats.map((chat) => chat.id);

    return await this.findMessages(chatIds, searchStr);
  }
}
