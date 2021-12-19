import { Controller, Get, Post } from '@nestjs/common';

import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  sendMessage() {
    this.messageService.createMessage(1, 2, 'test');
  }
}
