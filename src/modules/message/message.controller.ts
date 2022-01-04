import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Serialize } from 'decorators';

import { MessageDto } from './dto/message.dto';
import { AuthenticatedUser } from 'modules/auth/decorators';
import { JwtAuthGuard } from 'modules/auth/passport/jwt.guard';
import { User } from 'modules/user/user.entity';

import { Message } from './message.entity';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('/searchMessagesInProfileChats')
  @UseGuards(JwtAuthGuard)
  @Serialize(MessageDto)
  async getMessages(
    @Query() { search, chatId }: { search: string; chatId?: string },
    @AuthenticatedUser() user: User
  ): Promise<Message[]> {
    return this.messageService.findMessageForProfile(user.profile.id, search, chatId);
  }
}
