import { Expose, Transform } from 'class-transformer';

import { Profile } from '../profile.entity';

export class ProfileDto {
  @Expose()
  id: number;

  @Expose()
  displayedName: string;

  @Transform((params: { obj: Profile }) => {
    const { obj } = params;
    // console.log(obj);
    return obj.user.name;
  })
  @Expose()
  username: string;

  @Expose()
  avatarUrl: string | null;
}
