import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MediaDocument = Media & Document;

@Schema({ timestamps: true })
export class Media {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  fileType: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  url: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
