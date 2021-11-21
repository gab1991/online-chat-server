import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  nameOrEmail: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
