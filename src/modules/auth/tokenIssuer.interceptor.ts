import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

interface IContainsUserId {
  id: number;
}

const HOUR_IN_MS = '3600000';

@Injectable()
export class AuthCookieIssuer<T extends IContainsUserId> implements NestInterceptor<T, T> {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map((data: T) => {
        const res = context.switchToHttp().getResponse<Response>();

        const token = this.jwtService.sign({ _id: data.id });
        const maxCookieAge = this.configService.get<string>('TOKEN_COOKIE_MAX_AGE') || HOUR_IN_MS;

        res.cookie('authorization', token, {
          maxAge: Number(maxCookieAge),
          httpOnly: true, // prevent accessing cookie from js
          sameSite: 'lax',
          // secure: true  at first need to enable https
        });

        return data;
      })
    );
  }
}
