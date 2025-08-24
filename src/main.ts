// Import polyfills first
import './polyfills';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', '..', 'public'), {
    prefix: '/',
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false, // Temporarily allow unknown properties
    transform: true,
  }));

  // Enable CORS for the frontend application
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // Create super admin if not exists
  const authService = app.get(AuthService);
  await authService.createSuperAdmin();
  
  // Use Railway's dynamic port and listen on all interfaces
  const port = process.env.PORT || 2000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();