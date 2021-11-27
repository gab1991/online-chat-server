import { Expose, Transform } from 'class-transformer';

import { Profile } from '../profile.entity';
import { Chat } from 'modules/chat/chat.entity';

import { ProfileDto } from './profile.dto';

export class DetailedProfileDto extends ProfileDto {
  @Transform((params: { obj: Profile }) => {
    const { obj } = params;
    return obj.user.email;
  })
  @Expose()
  email: string;

  @Expose()
  chats: Chat[];
}
