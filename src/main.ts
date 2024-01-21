import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import AppConfig from './config/app.config';
import { getConfigToken } from './utils/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfig: AppConfig = app.get(getConfigToken(AppConfig));
  const { port } = appConfig;

  await app.listen(port);
}

bootstrap();
