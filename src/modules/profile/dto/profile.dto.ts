import { Expose } from 'class-transformer';

export class ProfileDto {
  @Expose()
  id: number;

  @Expose()
  displayedName: string;

  @Expose()
  avatarUrl: string | null;
}
