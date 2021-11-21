import { IsEmail, IsString, Length, Matches } from 'class-validator';

const passValidationRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export class UserCreationDto {
  @Length(4)
  @IsString()
  name: string;

  @Matches(passValidationRegex, { message: 'Password must contain 8 chars with at least 1 letter and 1 number' })
  password: string;

  @IsEmail()
  email: string;
}
