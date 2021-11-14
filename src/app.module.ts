import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'auth/auth.module';
import { typeOrmConfig } from 'configs/typeOrmConfig';
import { User } from 'user/user.entity';
import { UserModule } from 'user/user.module';

const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [isProd ? '.prod.env' : '.dev.env'], load: [typeOrmConfig] }),
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
