import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

interface ClassConstucter {
  new (...args: any[]): object;
}
export function Serialize(dto: ClassConstucter) {
  return UseInterceptors(new SerializeIntercepter(dto));
}
export class SerializeIntercepter implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //Run smth before request handled by req handler

    return next.handle().pipe(
      map((data: any) => {
        //Run smth before res sent out
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
