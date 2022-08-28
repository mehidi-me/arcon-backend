import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import dotenv from 'dotenv';
import { SecretsManager } from 'aws-sdk';

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;
  private readAwsConfig: boolean;

  constructor() {
    const result = dotenv.config();

    if (result.error) {
      this.envConfig = process.env;
    } else {
      this.envConfig = result.parsed;
    }

    if (this.envConfig.APP_ENV === 'development') {
      this.readAwsConfig = false;
    } else {
      this.readAwsConfig = true;
    }
  }

  public get(key: string): string {
    return this.envConfig[key];
  }

  public async getMongoConfig(): Promise<MongooseModuleOptions> {
    if (this.readAwsConfig) {
      //   await this.upAwsConfig();
      //   return {
      //     uri: this.get('DB_URI'),
      //   };
      return {
        uri: this.envConfig.DB_URI,
      };
    } else {
      return {
        uri: this.envConfig.DB_URI,
        // dbName: this.envConfig.DB_NAME,
        // auth: {
        //   username: this.envConfig.DB_USER_NAME,
        //   password: this.envConfig.DB_USER_PASS,
        // },
      };
      // }
    }
  }
}
