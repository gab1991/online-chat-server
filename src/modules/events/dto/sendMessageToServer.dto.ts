import { IsNumber, IsString } from 'class-validator';

export class SendMessageToServerDto {
  @IsNumber()
  chatId: number;

  @IsString()
  message: string;

  @IsNumber()
  senderId: number;
}
