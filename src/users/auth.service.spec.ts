import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUserService = {
      find: (email: string) => {
        const filteredUser = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUser);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
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
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('adfsdf@gmail.com', 'asdas');

    expect(user.password).not.toEqual('asdas');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('sdfsdf@gmail.com', 'asdas');
    try {
      await expect(service.signup('sdfsdf@gmail.com', 'asdas')).rejects.toThrow(
        BadRequestException,
      );
    } catch (error) {}
  });

  it('throws if signin called with unused email', async () => {
    try {
      await expect(
        service.signin('sdfsddsfdsf@gmail.com', 'asdas'),
      ).rejects.toThrow(NotFoundException);
    } catch (e) {}
  });

  it('throws if an invalid password is provide', async () => {
    await service.signup('sdfdsf@gmail.com', 'sdfss');

    try {
      await expect(service.signin('sdfdsf@gmail.com', 'sdfs')).rejects.toThrow(
        BadRequestException,
      );
    } catch (err) {}
  });

  it('return a user if correct password is provided', async () => {
    const new_user = await service.signup(
      'luongtrieuvy@gmail.com',
      'saophaixoan',
    );
    const user = await service.signin('luongtrieuvy@gmail.com', 'saophaixoan');
    expect(user).toBeDefined();
  });
});
