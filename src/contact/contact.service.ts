import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { sendEmailDto } from './dto/contact.dto';
import { sendEmailBySES } from './utils/ses_sendemail';

@Injectable()
export class ContactService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async sendEmail(data: sendEmailDto): Promise<string> {
    // await sendEmailBySES(data);
    return `Email sent to ${data.email} with message: ${data.message}`;
  }
}
