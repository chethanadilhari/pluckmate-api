import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unallowed fields
      forbidNonWhitelisted: true, // throws error for unknown fields
      transform: true, // auto-converts types (e.g., string to Date)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
