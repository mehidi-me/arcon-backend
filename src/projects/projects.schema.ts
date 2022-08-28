import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Media } from 'src/media/media.schema';
import { User } from 'src/users/user.schema';
import { Category } from '../categories/entities/category.entity';

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  clients: string;

  @Prop({ required: true })
  location: string;

  // should receive date.toDateString() or maybe just year?
  @Prop({ required: true })
  workingYear: string;

  @Prop({ required: true })
  ideas: string;

  @Prop({ required: true })
  challenges: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Media' })
  featureImg: Media;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }] })
  images: Media[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Category;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
