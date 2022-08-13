import { BaseController } from '../common/base.controller';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserService } from './user.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.IUserService) private userService: IUserService,
    ) {
        super(loggerService);
        this.bindRoutes([
            {
                path: '/register',
                method: 'post',
                func: this.register,
                middlewares: [new ValidateMiddleware(UserRegisterDto)],
            },
            {
                path: '/login',
                method: 'post',
                func: this.login,
                middlewares: [new ValidateMiddleware(UserLoginDto)],
            },
        ]);
    }

    async login(
        { body }: Request<{}, {}, UserLoginDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const user = await this.userService.validateUser(body);
        if (!user) {
            return next(new HTTPError(401, 'Authorization error'));
        }
        this.ok(res, `${body.email} is logged`);
    }

    async register(
        { body }: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const newUser = await this.userService.createUser(body);
        if (!newUser) {
            return next(new HTTPError(409, 'The user has already existed'));
        }
        this.ok(res, { name: newUser.name, email: newUser.email, id: newUser.id });
    }
}
