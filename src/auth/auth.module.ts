import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'configs';

import { UsersRepository } from 'user/user.repository';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository]), JwtModule.registerAsync({ useFactory: jwtConfig })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
