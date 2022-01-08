import { Expose } from 'class-transformer';

export class MessageDto {
  @Expose()
  id: number;

  @Expose()
  senderId: number;

  @Expose()
  message: string;

  @Expose()
  createdAt: string;

  @Expose()
  chatId: number;
}
