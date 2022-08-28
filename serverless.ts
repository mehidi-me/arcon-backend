import { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'arcon-backend',
  },
  plugins: ['serverless-offline'],

  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    stage: 'ci',
    // profile: 'zorgIT',
    apiGateway: {
      binaryMediaTypes: ['*/*'],
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: ['arn:aws:s3:::arcon/*'],
          },
        ],
      },
    },
  },
  functions: {
    main: {
      handler: 'dist/src/lambda.handler',
      environment: {
        FE_URL: 'https://master.dac4nrebr9yo0.amplifyapp.com',
        DB_URI:
          'mongodb+srv://mejan:1W7hNuwpu5LpPiBf@arcon.prwnh.mongodb.net/arcon?retryWrites=true&w=majority',
        AWS_S3_BUCKET: 'arcon',
        APP_ENV: 'production',
      },
      events: [
        {
          http: {
            method: 'ANY',
            path: '/',
          },
        },
        {
          http: {
            method: 'ANY',
            path: '{proxy+}',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
