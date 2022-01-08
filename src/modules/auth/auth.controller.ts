import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Serialize } from 'decorators';

import { JwtAuthGuard } from './passport/jwt.guard';
import { DetailedProfileDto } from 'modules/profile/dto/detailedProfile.dto';
import { Profile } from 'modules/profile/profile.entity';
import { ProfileService } from 'modules/profile/profile.service';
import { UserCreationDto, UserLoginDto } from 'modules/user/dto';
import { AppError, ArrErrorCode } from 'utils/appError';

import { AuthService } from './auth.service';
import { AuthCookieIssuer, AuthCookieRemover } from './interceptors';

@Controller('auth')
export class AuthController {
  constructor(private authServie: AuthService, private profileService: ProfileService) {}

  @Post('/signup')
  @Serialize(DetailedProfileDto)
  @UseInterceptors(AuthCookieIssuer)
  async signUp(@Body() userCreationDto: UserCreationDto): Promise<Profile> {
    try {
      const { id } = await this.authServie.signUp(userCreationDto);

      const profile = await this.profileService.getDetailedProfile(id);

      if (!profile) {
        throw new BadRequestException();
      }

      return profile;
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
  @Serialize(DetailedProfileDto)
  @UseInterceptors(AuthCookieIssuer)
  async signIn(@Body() userLoginDto: UserLoginDto): Promise<Profile> {
    const user = await this.authServie.signIn(userLoginDto);

    if (!user) {
      throw new UnauthorizedException('password or username/email is not correct');
    }

    const profile = await this.profileService.getDetailedProfile(user.profile.id);

    if (!profile) {
      throw new BadRequestException();
    }
    return profile;
  }

  @Get('/logout')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthCookieRemover)
  async logout(): Promise<string> {
    return 'Logged out';
  }
}
