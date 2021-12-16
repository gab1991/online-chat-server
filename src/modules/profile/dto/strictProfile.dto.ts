import { Expose } from 'class-transformer';

export class StrictProfileDto {
  @Expose()
  id: number;

  @Expose()
  displayedName: string;

  @Expose()
  avatarUrl: string | null;
}
