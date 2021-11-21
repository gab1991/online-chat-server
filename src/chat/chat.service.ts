import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ChatType } from './types';

import { CreatePrivateChatDto } from './dto/createPrivateChat.dto';

import { Chat } from './chat.entity';
import { ChatsRepository } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(@InjectRepository(ChatsRepository) private chatRepository: ChatsRepository) {}

  createPrivate(createPrivateChatDto: CreatePrivateChatDto): Promise<Chat> {
    const { creatorId, participants } = createPrivateChatDto;

    const privateChat = this.chatRepository.create({
      type: ChatType.private,
      creatorId,
      participants,
    });

    return this.chatRepository.save(privateChat);
  }
}
