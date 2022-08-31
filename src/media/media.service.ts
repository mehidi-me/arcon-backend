import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { Media } from './media.schema';

@Injectable()
export class MediaService {
  constructor(
    private cloudinary: CloudinaryService,
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>,
  ) {}

  async uploadImageToCloudinary(files) {
    // return await this.cloudinary.uploadImage(files).catch((e) => {
    //   console.log(e);
    // });
    // console.log(files);

    // files.forEach(async (img) => {

    // });

    try {
      const imagesData: UploadImageDto[] = [];

      //console.log(res);
      for (let i = 0; i < files.length; i++) {
        const res = await this.cloudinary.uploadImage(files[i]);
        imagesData.push({
          key: res.public_id,
          originalName: files[i].originalname,
          size: files[i].size,
          mimeType: files[i].mimetype,
          fileType: 'image',
          url: res.secure_url,
        });
      }

      if (imagesData.length) {
        console.log(imagesData);

        return await this.mediaModel.insertMany(imagesData);
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

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
