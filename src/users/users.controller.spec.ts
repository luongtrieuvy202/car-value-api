import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common/exceptions';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findOneBy: (id: number) => {
        return Promise.resolve({
          id,
          email: 'dfsdfdsfd@gmailc.com',
          password: 'odsfsdfds',
        } as User);
      },

      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'sdfds' }]);
      },
    };

    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email: email,
          password: password,
        } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all users returns a list of users with the given list email', async () => {
    const users = await controller.findAllUsers('adfsfasf@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('adfsfasf@gmail.com');
  });

  it('findUser return a single user with given id', async () => {
    const user = await controller.findUserById('1');
    expect(user).toBeDefined();
  });

  it('signin return a user with given email and password', async () => {
    const session = { userId: -10 };

    const user = await controller.signIn(
      {
        email: 'luongtrieuvy@gmail,com',
        password: 'sdfsdfdsf',
      },
      session,
    );

    expect(user).toBeDefined();
    expect(session.userId).toEqual(1);
  });

  it('findOne throw an error if user does not exist', async () => {
    fakeUserService.findOneBy = () => {
      return null;
    };

    try {
      await expect(controller.findUserById('1')).rejects.toThrow(
        NotFoundException,
      );
    } catch (error) {}
  });
});
