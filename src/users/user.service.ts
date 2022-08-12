import { IUserService } from './user.service.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class UserService implements IUserService {
    constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {}

    async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
        const newUser = new User(email, name);
        const salt = Number(this.configService.get('SALT'));
        await newUser.setPassword(password, salt);
        // Проверка на существующего пользователя. Вернуть null, если существует
        return newUser;
    }

    async validateUser(dto: UserLoginDto): Promise<boolean> {
        return true;
    }
}
