import { Project } from '../projects.schema';

export class CreateProjectDto {
  idea: string;
  challenges: string;
  images: ProjectImage[];
}

export class ProjectImage {
  _id: string;
  fileName: string;
  originalName: string;
  size: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectData {
  _id: string;
  idea: string;
  challenges: string;
  images: ProjectImage[];
  createdAt: Date;
  updatedAt: Date;
}
