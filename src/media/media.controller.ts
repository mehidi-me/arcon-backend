import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import { MediaService } from './media.service';
import { makeImageArray } from './utils/file-delete-utils';
import { editFileName, imageFileFilter } from './utils/file-upload-utils';

const BUCKET = 'arcon';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('upload/images')
  @UseInterceptors(
    FilesInterceptor('images', 4, {
      storage: multerS3({
        s3: new AWS.S3(),
        bucket: BUCKET,
        acl: 'public-read',
        key: editFileName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadImages(
    @Body() body,
    @UploadedFiles() files: Array<Express.MulterS3.File>,
  ) {
    console.dir(files, { depth: null });
    return await this.mediaService.uploadImages(files);
  }

  // @Get('get/:filePath')
  // seeUploadedFile(@Param('filePath') image, @Res() res) {
  //   return res.sendFile(image, { root: './files' });
  // }

  @Get('images')
  async getImages(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.mediaService.getAllImages(+page, +limit);
  }

  private deleteImagesFromAWS(imageKeys: string | string[]) {
    return new Promise((resolve, reject) => {
      // declaring new aws
      const S3 = new AWS.S3();
      const PARAMS = {
        Bucket: BUCKET,
        Delete: {
          // transforming single image to array
          Objects: makeImageArray(imageKeys),
        },
      };

      // deleting images
      S3.deleteObjects(PARAMS, function (err, data) {
        if (err) {
          reject(err);
        }
        const imageKeys: string[] = [];
        data.Deleted.forEach((image) => {
          imageKeys.push(image.Key);
        });

        resolve(imageKeys);
      });
    });
  }

  @Delete('images')
  async deleteImage(
    @Res() res: any,
    @Query('imageKeys') imageKeys: string | string[],
  ) {
    try {
      await this.deleteImagesFromAWS(imageKeys);
      // if imageKeys is not an array, make it an array
      await this.mediaService.deleteManyImages(
        Array.isArray(imageKeys) ? imageKeys : [imageKeys],
      );
      res.end();
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
