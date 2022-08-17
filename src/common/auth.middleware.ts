import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class AuthMiddleware implements IMiddleware {
    constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {}

    async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!req.headers.authorization) {
            return next();
        }

        const [bearer, token] = req.headers.authorization.split(' ');
        if (bearer !== 'Bearer') {
            return next();
        }

        await verify(token, this.configService.get('SECRET'), (err, payload) => {
            if (err) {
                return next();
            } else if (typeof payload !== 'string' && typeof payload !== 'undefined') {
                req.user = payload.email;
                next();
            }
        });
    }
}
