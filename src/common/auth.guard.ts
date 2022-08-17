import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http-error.class';

export class AuthGuard implements IMiddleware {
    execute(req: Request, res: Response, next: NextFunction): void {
        if (!req.user) {
            return next(new HTTPError(401, 'User is not authorized.'));
        }
        next();
    }
}
