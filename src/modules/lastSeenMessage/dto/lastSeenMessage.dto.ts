import { Expose } from 'class-transformer';

export class LastSeenMsgDto {
  @Expose()
  msgId: number;

  @Expose()
  chatId: number;

  @Expose()
  profileId: number;
}
