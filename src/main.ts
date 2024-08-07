/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { CustomIoAdapter } from './CustomIoAdapter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization', 
  });
  app.useWebSocketAdapter(new CustomIoAdapter(app));

  await app.listen(3000);
}
bootstrap();
