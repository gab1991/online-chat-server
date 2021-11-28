import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ChatType } from './types';

import { CreatePrivateChatDto } from './dto/createPrivateChat.dto';
import { ProfileRepository } from 'modules/profile/profile.repository';
import { AppError, ArrErrorCode } from 'utils/appError';

import { Chat } from './chat.entity';
import { ChatsRepository } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatsRepository) private chatRepository: ChatsRepository,
    @InjectRepository(ProfileRepository) private profileRepository: ProfileRepository //
  ) {}

  createPrivate(createPrivateChatDto: CreatePrivateChatDto): Promise<Chat> {
    const { creatorId, participants } = createPrivateChatDto;

    const privateChat = this.chatRepository.create({
      type: ChatType.private,
      creatorId,
      participants,
    });

    return this.chatRepository.save(privateChat);
  }

  async enterPrivateConversation(curUserProfileId: number, participantProfileId: number): Promise<Chat> {
    if (curUserProfileId === participantProfileId) {
      throw new AppError(
        ArrErrorCode.private_chat_same_participants,
        'cannot create private chat with the same participants'
      );
    }

    const [commonChat] = await this.chatRepository.findCommonChats([curUserProfileId, participantProfileId]);

    if (commonChat) {
      return this.chatRepository.findOneOrFail(commonChat.id);
    }

    const curUserProfile = await this.profileRepository.findOneOrFail(curUserProfileId);
    const participantProfile = await this.profileRepository.findOneOrFail(participantProfileId);

    const chat = this.chatRepository.create({
      participants: [curUserProfile, participantProfile],
      type: ChatType.private,
      creatorId: curUserProfileId,
    });

    return await this.chatRepository.save(chat);
  }
}
