import { IsNumber } from 'class-validator';

export class UpdLastSeenMsgDTO {
  @IsNumber()
  msgId: number;

  @IsNumber()
  chatId: number;
}
