import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { JsonJwtDecoded } from './types';

import { User } from 'modules/user/user.entity';
import { UsersRepository } from 'modules/user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private usersRepo: UsersRepository) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get('TOKEN_SECRET'),
    });
  }

  async validate(decodedJWT: JsonJwtDecoded): Promise<User | undefined> {
    return this.usersRepo.findOne({ where: [{ id: decodedJWT._id }] });
  }
}

const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies['authorization'];
  }

  return null;
};