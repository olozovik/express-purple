import { BaseController } from '../common/base.controller';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IUsersController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUsersService } from './users.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UsersController extends BaseController implements IUsersController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.IUsersService) private userService: IUsersService,
        @inject(TYPES.IConfigService) private configService: IConfigService,
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
            {
                path: '/info',
                method: 'get',
                func: this.info,
                middlewares: [new AuthGuard()],
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
        const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
        this.ok(res, { jwt });
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
        this.okCreate(res, { name: newUser.name, email: newUser.email, id: newUser.id });
    }

    async info({ user: email }: Request, res: Response, next: NextFunction): Promise<void> {
        const user = await this.userService.getUser(email);
        if (!user) {
            return next(new HTTPError(401, 'There is no such a user.'));
        }
        this.ok(res, { email: user.email, id: user.id });
    }

    private signJWT(email: string, secret: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    email,
                    iat: Math.floor(Date.now() / 1000),
                },
                secret,
                {
                    algorithm: 'HS256',
                },
                (err, token) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(token as string);
                },
            );
        });
    }
}
