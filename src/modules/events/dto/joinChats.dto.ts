import { IsNumber } from 'class-validator';

export class JoinChatsDto {
  @IsNumber({}, { each: true })
  chatIds: number[];

  @IsNumber()
  profileId: number;
}
