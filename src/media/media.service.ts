import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadImageDto } from './dto/upload-image.dto';
import { Media } from './media.schema';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>,
  ) {}

  async uploadImages(files: Array<Express.MulterS3.File>) {
    const imagesData: UploadImageDto[] = [];
    files.forEach((img) => {
      imagesData.push({
        key: img.key,
        originalName: img.originalname,
        size: img.size,
        mimeType: img.mimetype,
        fileType: 'image',
        url: img.location,
      });
    });

    return await this.mediaModel.insertMany(imagesData);
  }

  async getAllImages(page?: number, _limit?: number) {
    const allImages = await this.mediaModel.find().exec();
    if (!page) {
      return allImages;
    }
    const limit = _limit || 18;
    const skip = (page - 1) * limit;
    const images = await this.mediaModel.find({}, null, {
      skip,
      limit,
    });
    const count = allImages.length;
    return {
      images,
      nextPage: skip + limit < count ? page + 1 : false,
    };
  }

  async deleteManyImages(images: string[]) {
    return this.mediaModel.deleteMany({
      key: images,
    });
  }
}
