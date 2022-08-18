import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UsersController } from './users/users.controller';
import { IUsersController } from './users/users.controller.interface';
import { UsersService } from './users/users.service';
import { IUsersService } from './users/users.service.interface';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { UsersRepository } from './users/users.repository';
import { IUsersRepository } from './users/users.repository.interface';
import { AuthMiddleware } from './common/auth.middleware';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
    bind<IUsersController>(TYPES.IUsersController).to(UsersController);
    bind<IUsersService>(TYPES.IUsersService).to(UsersService);
    bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
    bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
    bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository).inSingletonScope();
    bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);
    bind<App>(TYPES.Application).to(App);
});

export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

const bootstrap = (): IBootstrapReturn => {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init();
    return { appContainer, app };
};

export const { app, appContainer } = bootstrap();
