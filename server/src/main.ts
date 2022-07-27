import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true
  });
  app.use(passport.initialize());
  app.useGlobalPipes(new ValidationPipe(
      {
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true
        }
      }
  ));
  await app.listen(5000);
}
bootstrap();
