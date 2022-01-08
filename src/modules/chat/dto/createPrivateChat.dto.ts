import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

import { Profile } from 'modules/profile/profile.entity';

export class CreatePrivateChatDto {
  @IsNumber()
  creatorId: number;

  @IsArray()
  @ValidateNested()
  @Type(() => Profile)
  participants: Profile[];
}
