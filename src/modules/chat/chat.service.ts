import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ChatDetailed, ChatType } from './types';

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

  async enterPrivateConversation(curUserProfileId: number, participantProfileId: number): Promise<ChatDetailed> {
    if (curUserProfileId === participantProfileId) {
      throw new AppError(
        ArrErrorCode.private_chat_same_participants,
        'cannot create private chat with the same participants'
      );
    }

    const [commonChat] = await this.chatRepository.findCommonChats([curUserProfileId, participantProfileId]);
    console.log(commonChat);

    if (commonChat) {
      const chat = await this.chatRepository.findOneOrFail(commonChat.id, { relations: ['messages', 'participants'] });
      return this.makeDetailedPrivateChat(chat, curUserProfileId);
    }

    const curUserProfile = await this.profileRepository.findOneOrFail(curUserProfileId);
    const participantProfile = await this.profileRepository.findOneOrFail(participantProfileId);

    const chat = this.chatRepository.create({
      participants: [curUserProfile, participantProfile],
      type: ChatType.private,
      creatorId: curUserProfileId,
      messages: [],
    });

    const savedChat = await this.chatRepository.save(chat);
    return this.makeDetailedPrivateChat(savedChat, curUserProfileId);
  }

  async getChatsDetailed(participantId: number): Promise<ChatDetailed[]> {
    const chats = await this.chatRepository.findChatsByParticipantId(participantId);
    const detailedChats: ChatDetailed[] = [];

    for (const chat of chats) {
      if (chat.type === ChatType.private) {
        detailedChats.push(this.makeDetailedPrivateChat(chat, participantId));
      }
    }

    return detailedChats;
  }

  makeDetailedPrivateChat(chat: Chat, participantId: number): ChatDetailed {
    const convPartner = chat.participants.find((participant) => participant.id !== participantId);
    const detailedChat = {
      ...chat,
      avatarUrl: convPartner?.avatarUrl || null,
      title: convPartner?.displayedName || null,
    };
    return detailedChat;
  }
}
