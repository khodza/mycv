import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/dtos/user.dto';
@Injectable()
export class SerializeIntercepter implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //Run smth before request handled by req handler

    return next.handle().pipe(
      map((data: any) => {
        //Run smth before res sent out
        return plainToClass(UserDto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
