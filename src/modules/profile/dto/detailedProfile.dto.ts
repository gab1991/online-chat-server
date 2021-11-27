import { Expose } from 'class-transformer';

import { Chat } from 'modules/chat/chat.entity';

export class DetailedProfileDto {
  @Expose()
  id: number;

  @Expose()
  displayedName: string;

  @Expose()
  avatarUrl: string | null;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  chats: Chat[];
}
