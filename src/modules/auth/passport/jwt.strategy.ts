import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { JsonJwtDecoded } from './types';

import { ProfileRepository } from 'modules/profile/profile.repository';
import { UsersRepository } from 'modules/user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersRepo: UsersRepository,
    private profileRepo: ProfileRepository
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get('TOKEN_SECRET'),
    });
  }

  async validate(decodedJWT: JsonJwtDecoded): Promise<any | undefined> {
    const profile = await this.profileRepo.findOne({ where: [{ id: decodedJWT._id }] });

    return await this.usersRepo.findOne({
      where: [{ profile: profile }],
      relations: ['profile'],
    });
  }
}

const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies['authorization'];
  }

  return null;
};
