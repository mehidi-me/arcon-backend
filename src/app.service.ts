import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello From ${process.env.APP_ENV} which deployed by aws`;
  }
}
