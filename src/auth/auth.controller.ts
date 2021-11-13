import { Body, ConflictException, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppError, ArrErrorCode } from 'src/utils/appError';
import { UserLoginDto, UserCreationDto } from 'src/user/dto';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authServie: AuthService) {}
  @Post('/signup')
  async signUp(@Body() userCreationDto: UserCreationDto): Promise<void> {
    try {
      await this.authServie.signUp(userCreationDto);
    } catch (err) {
      if (err instanceof AppError && err.appErrCode == ArrErrorCode.username_exist) {
        throw new ConflictException(`name ${userCreationDto.name} is already taken`);
      }
      if (err instanceof AppError && err.appErrCode == ArrErrorCode.email_exist) {
        throw new ConflictException(`email ${userCreationDto.email} is already taken`);
      }
      throw err;
    }
  }

  @Post('/signin')
  @HttpCode(200)
  signIn(@Body() userLoginDto: UserLoginDto): Promise<User> {
    return this.authServie.signIn(userLoginDto);
  }
}
