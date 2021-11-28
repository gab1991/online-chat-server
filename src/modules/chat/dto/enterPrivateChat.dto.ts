import { IsNumber } from 'class-validator';

export class EnterPrivateChatDto {
  @IsNumber()
  participantId: number;
}
