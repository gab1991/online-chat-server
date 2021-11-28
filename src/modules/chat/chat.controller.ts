import { BadRequestException, Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';

import { EnterPrivateChatDto } from './dto/enterPrivateChat.dto';
import { AuthenticatedUser } from 'modules/auth/decorators';
import { JwtAuthGuard } from 'modules/auth/passport/jwt.guard';
import { User } from 'modules/user/user.entity';

import { Chat } from './chat.entity';
import { ChatService } from './chat.service';
import { OnlineService } from './online.service';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService, private onlineService: OnlineService) {}

  @Post('/enterChat')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  enterChat(@Body() enterPrivateChatDto: EnterPrivateChatDto, @AuthenticatedUser() user: User): Promise<Chat> {
    const { participantId } = enterPrivateChatDto;
    const currentUserId = user.profile.id;

    if (participantId === currentUserId) {
      throw new BadRequestException('this feature in development');
    }

    return this.chatService.enterPrivateConversation(currentUserId, participantId);
  }

  @Get('isOnline')
  isOnline() {
    return this.onlineService.getAllLists();
  }
}
