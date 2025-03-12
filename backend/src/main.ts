import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/Http-exception-filter';
import { ConfigService } from './config/config.service';
import * as helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  app.use(helmet.default());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests from this IP, please try again later',
    }),
  );

  app.use('/users/login', rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later',
  }));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const port = configService.port;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();