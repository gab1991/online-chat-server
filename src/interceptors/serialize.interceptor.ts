import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

export class SerializeInterceptor<R extends ClassConstructor<unknown> = ClassConstructor<unknown>>
  implements NestInterceptor
{
  constructor(private dto: R) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      })
    );
  }
}
