import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUser = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUser);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates new user with salted and hashed password', async () => {
    const user = await service.signup('khodzapro@gmail.com', '2003qwerty');
    expect(user.password).not.toEqual('2003qwerty');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error when user signs with existing email', async () => {
    await service.signup('khodzapro@gmail.com', '2003qwerty');
    await expect(
      service.signup('khodzapro@gmail.com', '2003qwerty'),
    ).rejects.toThrowError(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('khodzapro@gmail.com', '2003qwerty'),
    ).rejects.toThrowError(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('khodzapro@gmail.com', '2003qwerty');
    await expect(
      service.signin('khodzapro@gmail.com', '2003qwerty1'),
    ).rejects.toThrowError(BadRequestException);
  });
  it('returns user if correct password provided ', async () => {
    await service.signup('khodzapro@gmail.com', '2003qwerty');

    const user = await service.signin('khodzapro@gmail.com', '2003qwerty');
    expect(user).toBeDefined();
  });
});
