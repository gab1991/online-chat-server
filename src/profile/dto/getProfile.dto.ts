import { IsNumberString } from 'class-validator';

export class GetProfileParamsDto {
  @IsNumberString()
  id: string;
}
