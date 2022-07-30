import { App } from './app';
import { LoggerService } from './logger/logger.service.js';

const bootstrap = async () => {
  const app = new App(new LoggerService());
  app.init();
};

bootstrap();
