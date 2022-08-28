import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Response,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createProject(@Body() body, @Response() res) {
    try {
      const newProject = await this.projectsService.createProject(body);
      res.status(HttpStatus.CREATED).send(newProject);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Get(':id')
  async getSingleProject(@Param('id') id) {
    return await this.projectsService.getProject(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateProject(@Param('id') id, @Body() body) {
    return await this.projectsService.updateProject(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProject(@Param('id') id) {
    return await this.projectsService.deleteProject(id);
  }

  @Get('category/:id')
  async getProjectById(@Param('id') id: string) {
    return this.projectsService.getProjectsByCategoryId(id);
  }

  @Get()
  async getPaginatedProjects(@Query('page') page?: string): Promise<any> {
    return this.projectsService.getPaginatedProjects(+page);
  }
}
