import { IUserService } from './user.service.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.IConfigService) private configService: IConfigService,
        @inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository,
    ) {}

    async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
        const newUser = new User(email, name);
        const salt = Number(this.configService.get('SALT'));
        await newUser.setPassword(password, salt);
        const existedUser = await this.usersRepository.find(email);

        if (existedUser) {
            return null;
        }

        return this.usersRepository.create(newUser);
    }

    async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
        const existedUser = await this.usersRepository.find(email);
        if (!existedUser) {
            return false;
        }
        const reqUser = new User(existedUser.email, existedUser.name, existedUser.password);
        return await reqUser.comparePassword(password);
    }

    async getUser(email: string): Promise<UserModel | null> {
        return await this.usersRepository.find(email);
    }
}
