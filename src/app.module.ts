import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, typeOrmConfig } from 'configs';
import { isProd } from 'main';
import { AuthModule, ChatModule, LastSeenMsgModule, MessageModule, ProfileModule, UserModule } from 'modules';

import { EventsModule } from './modules/events/events.module';

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
    MessageModule,
    EventsModule,
    LastSeenMsgModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
