import { IsNumber } from 'class-validator';

export class SetIsOnlineDto {
  @IsNumber()
  profileId: number;
}
