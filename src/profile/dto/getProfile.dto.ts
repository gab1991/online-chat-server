import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class GetProfileParamsDto {
  @IsNumberString()
  id: string;
}

export class GetProfileServiceDto extends GetProfileParamsDto {
  @IsString()
  @IsNotEmpty()
  host: string;
}
