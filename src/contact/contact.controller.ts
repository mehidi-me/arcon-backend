import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { sendEmailDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async sendEmail(@Body() sendEmailDto: sendEmailDto) {
    return await this.contactService.sendEmail(sendEmailDto);
  }
}
