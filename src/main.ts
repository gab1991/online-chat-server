import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

import { AppModule } from './app.module';

export const isProd = process.env.NODE_ENV === 'production';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: isProd ? false : { origin: ['http://localhost:3000'], credentials: true },
  });

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useStaticAssets(join(__dirname, '../public/avatars'), { index: false, prefix: '/avatars' });
  app.useStaticAssets(join(__dirname, '../public/dist'));
  app.use(cookieParser());

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
