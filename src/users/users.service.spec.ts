import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface';
import { TYPES } from '../types';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
    get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
    find: jest.fn(),
    create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUsersService;

beforeAll(() => {
    container.bind<IUsersService>(TYPES.IUsersService).to(UsersService);
    container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(ConfigServiceMock);
    container.bind<IUsersRepository>(TYPES.IUsersRepository).toConstantValue(UsersRepositoryMock);

    configService = container.get<IConfigService>(TYPES.IConfigService);
    usersRepository = container.get<IUsersRepository>(TYPES.IUsersRepository);
    usersService = container.get<IUsersService>(TYPES.IUsersService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
    it('createUser', async () => {
        configService.get = jest.fn().mockReturnValueOnce('1');
        usersRepository.create = jest.fn().mockImplementationOnce((user: User): UserModel => {
            return {
                email: user.email,
                password: user.password,
                name: user.name,
                id: 1,
            };
        });
        createdUser = await usersService.createUser({
            email: 'john@yahoo.com',
            password: '123455667',
            name: 'John',
        });
        expect(createdUser?.id).toEqual(1);
        expect(createdUser?.password).not.toEqual('123455667');
    });

    it('validateUser - success', async () => {
        usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
        const result = await usersService.validateUser({
            email: 'john@yahoo.com',
            password: '123455667',
        });
        expect(result).toBeTruthy();
    });

    it('validateUser - wrong password', async () => {
        usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
        const result = await usersService.validateUser({
            email: 'john@yahoo.com',
            password: '123455667_',
        });
        expect(result).toBeFalsy();
    });

    it('validateUser - wrong user', async () => {
        usersRepository.find = jest.fn().mockReturnValueOnce(null);
        const result = await usersService.validateUser({
            email: 'john@yahoo.com',
            password: '123455667',
        });
        expect(result).toBeFalsy();
    });
});
