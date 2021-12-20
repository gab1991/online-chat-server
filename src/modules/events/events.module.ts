import { Module } from '@nestjs/common';
import { MessageModule } from 'modules';

import { EventsGateway } from './events.gateway';

@Module({
  imports: [MessageModule],
  providers: [EventsGateway],
})
export class EventsModule {}
