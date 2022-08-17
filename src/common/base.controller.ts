import { Router, Response } from 'express';
import { injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { IControllerRoute, RouteReturnType } from './route.interface';
export { Router } from 'express';

@injectable()
export abstract class BaseController {
    private readonly _router: Router;

    constructor(private logger: ILogger) {
        this._router = Router();
    }

    get router(): Router {
        return this._router;
    }

    public send<T>(res: Response, code: number, message: T): RouteReturnType {
        res.type('application/json');
        return res.status(code).json(message);
    }

    public ok<T>(res: Response, message: T): RouteReturnType {
        return this.send(res, 200, message);
    }

    public okCreate<T>(res: Response, message: T): RouteReturnType {
        return this.send(res, 201, message);
    }

    protected bindRoutes(routes: IControllerRoute[]): void {
        for (const route of routes) {
            this.logger.log(`[${route.method}] ${route.path}`);
            const middlewares = route.middlewares?.map(m => m.execute.bind(m));
            const handler = route.func.bind(this);
            const pipeline = middlewares ? [...middlewares, handler] : handler;
            this.router[route.method](route.path, pipeline);
        }
    }
}
