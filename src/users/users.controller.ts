import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserDTO } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import { UseGuards } from '@nestjs/common';
@Serialize(UserDTO)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }
  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }
  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
    return;
  }
  @Post('/signup')
  async createUser(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  @Post('/signin')
  async signin(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  @Get('/:id')
  // @UseInterceptors(new SerializeIntercepter(UserDto))
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return this.usersService.update(+id, body);
  }
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
