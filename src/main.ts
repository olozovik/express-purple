import { App } from './app';
import { LoggerService } from './logger/logger.service.js';
import { UserController } from './users/users.controller';

const bootstrap = async () => {
  const logger = new LoggerService();
  const app = new App(logger, new UserController(logger));
  await app.init();
};

bootstrap();
