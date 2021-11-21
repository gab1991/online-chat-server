import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, typeOrmConfig } from 'configs';
import { AuthModule, ChatModule, MessageModule, ProfileModule, UserModule } from 'modules';

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
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
