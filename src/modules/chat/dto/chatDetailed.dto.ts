import { Expose, Type } from 'class-transformer';

import { StrictProfileDto } from 'modules/profile/dto/strictProfile.dto';

import { ChatDto } from './chat.dto';

export class ChatDetailedDto extends ChatDto {
  @Expose()
  avatarUrl: string | null;

  @Type(() => StrictProfileDto)
  @Expose()
  participants: StrictProfileDto[];
}
