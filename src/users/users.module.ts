import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { CurrentUserInterseptor } from './interseptors/current-user.interseptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    AuthService,
    { provide: APP_INTERCEPTOR, useClass: CurrentUserInterseptor },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
