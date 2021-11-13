import { IsString, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  nameOrEmail: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
