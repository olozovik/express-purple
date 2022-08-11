import { IUserService } from './user.service.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { injectable } from 'inversify';

@injectable()
export class UserService implements IUserService {
    async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
        const newUser = new User(email, name);
        await newUser.setPassword(password);
        // Проверка на существующего пользователя. Вернуть null, если существует
        return newUser;
    }

    async validateUser(dto: UserLoginDto): Promise<boolean> {
        return true;
    }
}
