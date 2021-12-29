import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { ChatMessagesMap } from './types';

import { AuthenticatedUser } from 'modules/auth/decorators';
import { JwtAuthGuard } from 'modules/auth/passport/jwt.guard';
import { User } from 'modules/user/user.entity';

import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('/searchMessagesInProfileChats')
  @UseGuards(JwtAuthGuard)
  async getMessages(
    @Query() { search }: { search: string },
    @AuthenticatedUser() user: User
  ): Promise<ChatMessagesMap> {
    console.log(search);
    return this.messageService.findMessageForProfile(user.profile.id, search);
  }
}
