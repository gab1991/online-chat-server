import { Expose, Transform } from 'class-transformer';

import { Profile } from '../profile.entity';

export class ProfileDto {
  @Expose()
  id: number;

  @Transform((params: { obj: Profile }) => {
    const { obj } = params;
    return obj.user.name;
  })
  @Expose()
  username: string;

  @Expose()
  displayedName: string;

  @Expose()
  avatarUrl: string | null;
}
