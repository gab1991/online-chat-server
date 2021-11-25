import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Serialize } from 'decorators';

import { AuthCookieIssuer } from './interceptors/authCookieIssuer.interceptor';
import { JwtAuthGuard } from './passport/jwt.guard';
import { UserCreationDto, UserLoginDto } from 'modules/user/dto';
import { UserDto } from 'modules/user/dto/user.dto';
import { User } from 'modules/user/user.entity';
import { AppError, ArrErrorCode } from 'utils/appError';

import { AuthService } from './auth.service';
import { AuthenticatedUser } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private authServie: AuthService) {}

  @Post('/signup')
  @Serialize(UserDto)
  async signUp(@Body() userCreationDto: UserCreationDto): Promise<User> {
    try {
      return await this.authServie.signUp(userCreationDto);
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
  @Serialize(UserDto)
  @UseInterceptors(AuthCookieIssuer)
  async signIn(@Body() userLoginDto: UserLoginDto): Promise<User> {
    const user = await this.authServie.signIn(userLoginDto);

    if (!user) {
      throw new UnauthorizedException('password or username/email is not correct');
    }
    return user;
  }

  @Post('/checkCredentials')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async checkCredentials(@AuthenticatedUser() user: User): Promise<User> {
    return user;
  }
}
