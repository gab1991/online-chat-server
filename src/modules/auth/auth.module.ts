import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'configs';

import { JwtStrategy } from './passport/jwt.strategy';
import { ProfileRepository } from 'modules/profile/profile.repository';
import { UsersRepository } from 'modules/user/user.repository';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCookieIssuer } from './interceptors';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository, ProfileRepository]),
    JwtModule.registerAsync({ useFactory: jwtConfig }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthCookieIssuer],
})
export class AuthModule {}
