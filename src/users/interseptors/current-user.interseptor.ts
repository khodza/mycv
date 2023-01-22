import { Injectable, NestInterceptor } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs';
import { ExecutionContext } from '@nestjs/common';
import { CallHandler } from '@nestjs/common';

@Injectable()
export class CurrentUserInterseptor implements NestInterceptor {
  constructor(private userService: UsersService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      const user = this.userService.findOne(userId);
      request.currentUser = user;
    }
    return next.handle();
  }
}
