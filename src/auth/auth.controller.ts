import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SerializeInterceptor } from 'interceptors';

import { RequestWithUser } from './passport/types';

import { JwtAuthGuard } from './passport/jwt.guard';
import { UserCreationDto, UserLoginDto } from 'user/dto';
import { UserDto } from 'user/dto/user.dto';
import { User } from 'user/user.entity';
import { AppError, ArrErrorCode } from 'utils/appError';

import { AuthService } from './auth.service';
import { AuthCookieIssuer } from './tokenIssuer.interceptor';

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
  @UseInterceptors(AuthCookieIssuer, new SerializeInterceptor(UserDto))
  async signIn(@Body() userLoginDto: UserLoginDto): Promise<User> {
    const user = await this.authServie.signIn(userLoginDto);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  @Post('/checkCredentials')
  @UseGuards(JwtAuthGuard)
  async checkCredentials(@Req() req: RequestWithUser): Promise<User> {
    return req.user;
  }
}
