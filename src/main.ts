import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

import { AppModule } from './app.module';

export const isProd = process.env.NODE_ENV === 'production';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: !isProd });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useStaticAssets(join(__dirname, '../public/avatars'), { index: false, prefix: '/avatars' });
  app.use(cookieParser());

  await app.listen(8000);
}
bootstrap();
