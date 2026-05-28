import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean);

  app.enableCors({
    origin: allowedOrigins?.length ? allowedOrigins : true,
    credentials: true,
  });
  const globalPrefix = process.env.API_GLOBAL_PREFIX === 'none' ? '' : (process.env.API_GLOBAL_PREFIX ?? 'api');
  if (globalPrefix) {
    app.setGlobalPrefix(globalPrefix);
  }
  const port = Number(process.env.PORT) || 5000;
  await app.listen(port);
  console.log(`Backend API running on port ${port}${globalPrefix ? ` with /${globalPrefix} prefix` : ''}`);
}
bootstrap();
