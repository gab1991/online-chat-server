import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

interface IContainsUserId {
  id: number;
}

@Injectable()
export class AuthCookieRemover<T extends IContainsUserId> implements NestInterceptor<T, T> {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map((data: T) => {
        const res = context.switchToHttp().getResponse<Response>();

        res.clearCookie('authorization');
        return data;
      })
    );
  }
}
