import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './projects.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}

  async createProject(project: CreateProjectDto) {
    const createdProject = new this.projectModel(project);
    return await createdProject.save();
  }

  async getAllProjects() {
    return await this.projectModel
      .find()
      .populate('images')
      .populate('featureImg')
      .populate('category')
      .exec();
  }

  /**
   * returns a single project based on document id
   * with related projects
   * @param id
   */
  async getProject(id: string) {
    const project = await this.projectModel
      .findById(id)
      .populate('images')
      .populate('featureImg')
      .populate('category')
      .exec();
    if (!project) {
      throw new NotFoundException();
    }
    const limit = 4;
    const relatedProjects = await this.projectModel
      .find(
        {
          _id: { $ne: id }, // $ne means not equal
          category: project.category, // we don't need to specify the category._id
        },
        null,
        {
          limit,
        },
      )
      .populate('images')
      .populate('featureImg')
      .exec();

    // converting project to JSON object
    // otherwise it returns the model document
    const jsonProject = project.toObject();
    return { ...jsonProject, relatedProjects };
  }

  async updateProject(id: string, newData: any) {
    return this.projectModel.findByIdAndUpdate(id, newData, {
      new: true,
    });
  }

  async deleteProject(id: string) {
    return this.projectModel.findByIdAndDelete(id);
  }

  async getProjectsByCategoryId(categoryId: string) {
    return this.projectModel
      .find()
      .where({ category: categoryId })
      .populate('featureImg')
      .exec();
  }

  async getPaginatedProjects(pageCount?: number) {
    if (!pageCount) {
      return this.projectModel
        .find()
        .populate('images')
        .populate('featureImg')
        .populate('category')
        .exec();
    }
    const take = 6;
    const skip = (pageCount - 1) * take;
    const projects = await this.projectModel
      .find()
      .skip(skip)
      .limit(take)
      .populate('images')
      .populate('featureImg')
      .exec();

    const count = await this.projectModel.count();
    return {
      projects,
      nextPage: take + skip < count ? pageCount + 1 : false,
    };
  }
}
