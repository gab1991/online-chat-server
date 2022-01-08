import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

import { isWebSocketResponse } from 'utils/typeguards';

export class SerializeInterceptor<R extends ClassConstructor<unknown> = ClassConstructor<unknown>>
  implements NestInterceptor
{
  constructor(private dto: R) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const type = context.getType();

    return next.handle().pipe(
      map((res: WsResponse | unknown) => {
        if (type === 'ws' && isWebSocketResponse(res)) {
          return {
            event: res.event,
            data: plainToClass(this.dto, res.data, { excludeExtraneousValues: true }),
          };
        }

        return plainToClass(this.dto, res, { excludeExtraneousValues: true });
      })
    );
  }
}
