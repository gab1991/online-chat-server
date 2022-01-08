import { forwardRef, Module } from '@nestjs/common';
import { ChatModule, MessageModule } from 'modules';

import { EventsGateway } from './events.gateway';
import { OnlineService } from './online.service';

@Module({
  imports: [forwardRef(() => MessageModule), forwardRef(() => ChatModule)],
  providers: [EventsGateway, OnlineService],
  exports: [EventsGateway],
})
export class EventsModule {}
