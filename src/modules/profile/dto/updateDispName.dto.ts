import { IsString, Length } from 'class-validator';

export class UpdDispNameDto {
  @IsString()
  @Length(4, 16)
  displayedName: string;
}
