import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { Cat } from './cats.schema';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    await this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(@Request() req): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
