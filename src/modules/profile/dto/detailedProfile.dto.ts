import { Expose, Transform, Type } from 'class-transformer';

import { Profile } from '../profile.entity';
import { ChatDto } from 'modules/chat/dto/chat.dto';

import { ProfileDto } from './profile.dto';

export class DetailedProfileDto extends ProfileDto {
  @Transform((params: { obj: Profile }) => {
    const { obj } = params;
    return obj.user.email;
  })
  @Expose()
  email: string;

  @Type(() => ChatDto)
  @Expose()
  chats: ChatDto[];
}
