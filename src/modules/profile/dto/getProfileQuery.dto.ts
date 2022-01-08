import { IsOptional, IsString } from 'class-validator';

export class GetProfileQuery {
  @IsString()
  @IsOptional()
  name: string;
}
