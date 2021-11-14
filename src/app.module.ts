import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, typeOrmConfig } from 'configs';

import { AuthModule } from 'auth/auth.module';
import { User } from 'user/user.entity';
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
        entities: [User],
        ...typeOrmConfig(),
      }),
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
