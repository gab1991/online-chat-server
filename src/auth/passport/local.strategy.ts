import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { UserCreationDto, UserLoginDto } from 'user/dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(UserLoginDto: UserLoginDto): Promise<any> {
    console.log(UserLoginDto);

    const user = await this.authService.signIn(UserLoginDto);

    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
