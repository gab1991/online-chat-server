import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { Serialize } from 'decorators';

import { LastSeenMsgDto } from './dto/lastSeenMessage.dto';
import { UpdLastSeenMsgDTO } from './dto/updLastSeenMessage.dto';
import { AuthenticatedUser } from 'modules/auth/decorators';
import { JwtAuthGuard } from 'modules/auth/passport/jwt.guard';
import { User } from 'modules/user/user.entity';

import { LastSeenMsg } from './lastSeenMessage.entity';
import { LastSeenMessageService } from './lastSeenMessage.service';

@Controller('lastSeenMessages')
export class LastSeenMessageController {
  constructor(private lastSeenMessageService: LastSeenMessageService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Serialize(LastSeenMsgDto)
  async getLastSeenMsgsByProfile(@AuthenticatedUser() user: User): Promise<LastSeenMsg[]> {
    const lastSeenMsgs = await this.lastSeenMessageService.getLastSeenMsgsByProfileId(user.profile.id);
    return lastSeenMsgs;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @Serialize(LastSeenMsgDto)
  async updateLastSeenMsg(
    @AuthenticatedUser() user: User,
    @Body() updLastSeenMsgDto: UpdLastSeenMsgDTO
  ): Promise<LastSeenMsg> {
    const newLastSeenMsg = await this.lastSeenMessageService.updateLastSeenMsg(
      user.profile.id,
      updLastSeenMsgDto.chatId,
      updLastSeenMsgDto.msgId
    );

    return newLastSeenMsg;
  }
}
