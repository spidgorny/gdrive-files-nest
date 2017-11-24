import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/app.module';
const express = require('express');

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.use(express.static('static'));
  await app.listen(3000);
}
bootstrap();
