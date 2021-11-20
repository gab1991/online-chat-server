import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, typeOrmConfig } from 'configs';

import { ChatModule } from './chat/chat.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from 'auth/auth.module';
import { UserModule } from 'user/user.module';

const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [isProd ? '.prod.env' : '.dev.env'],
      load: [typeOrmConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        entities: [__dirname + '/../**/*.entity.js'],
        ...typeOrmConfig(),
      }),
    }),
    UserModule,
    AuthModule,
    ProfileModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
