import { NestFactory } from '@nestjs/core';
import AWS from 'aws-sdk';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enabling cors in development for every url
  // in production only for front end url
  if (process.env.APP_ENV !== 'production') {
    app.enableCors({
      allowedHeaders: ['content-type'],
      origin: process.env.FE_URL,
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: process.env.FE_URL,
      credentials: true,
    });
  }

  app.use(cookieParser());

  AWS.config.update({ region: process.env.AWS_REGION });
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
