import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'kgwfw',
          password: 'fwcw',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 12, email, password: 'dacwd' } as User]);
      },
    };
    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('it returns all the users with given email', async () => {
    const users = await controller.findAllUsers('khodzapro@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('khodzapro@gmail.com');
  });

  it('it returns a single user with given ID', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws error when if user with giver ID not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('2')).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('signin updates session ID and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      {
        email: 'khodzapro@gmail.com',
        password: '2003',
      },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
