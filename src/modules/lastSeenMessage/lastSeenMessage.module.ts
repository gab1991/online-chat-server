import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LastSeenMessageController } from './lastSeenMessage.controller';
import { LastSeenMsgRepository } from './lastSeenMessage.repository';
import { LastSeenMessageService } from './lastSeenMessage.service';

@Module({
  imports: [TypeOrmModule.forFeature([LastSeenMsgRepository])],
  controllers: [LastSeenMessageController],
  providers: [LastSeenMessageService],
  exports: [],
})
export class LastSeenMsgModule {}
