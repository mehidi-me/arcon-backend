import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import AWS from 'aws-sdk';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.APP_ENV === 'production' ? process.env.FE_URL : '*',
      credentials: true,
    },
  });
  app.use(cookieParser());

  await app.init();

  AWS.config.update({ region: process.env.AWS_REGION });

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
