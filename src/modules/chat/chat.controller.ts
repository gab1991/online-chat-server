import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from 'decorators';

import { ChatDetailed } from './types';

import { ChatDetailedDto } from './dto/chatDetailed.dto';
import { EnterPrivateChatDto } from './dto/enterPrivateChat.dto';
import { AuthenticatedUser } from 'modules/auth/decorators';
import { JwtAuthGuard } from 'modules/auth/passport/jwt.guard';
import { User } from 'modules/user/user.entity';

import { Chat } from './chat.entity';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('/enterChat')
  @HttpCode(200)
  @Serialize(ChatDetailedDto)
  @UseGuards(JwtAuthGuard)
  async enterChat(
    @Body() enterPrivateChatDto: EnterPrivateChatDto,
    @AuthenticatedUser() user: User
  ): Promise<Chat> {
    const { participantId } = enterPrivateChatDto;
    const currentUserId = user.profile.id;

    if (participantId === currentUserId) {
      throw new BadRequestException('this feature in development');
    }

    return await this.chatService.enterPrivateConversation(currentUserId, participantId);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @Serialize(ChatDetailedDto)
  async getChatsByParticipant(@AuthenticatedUser() user: User): Promise<ChatDetailed[]> {
    return await this.chatService.getChatsDetailed(user.profile.id);
  }
}
