import { extname } from 'path';
import AWS from 'aws-sdk';
import fs from 'fs';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `images/${name}-${randomName}${fileExtName}`);
};

export const uploadFileToS3 = async (file: Express.Multer.File) => {
  const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  const s3 = new AWS.S3();
  const fileStream = fs.createReadStream(file.buffer);

  const bucketParams: AWS.S3.PutObjectRequest = {
    Bucket: AWS_S3_BUCKET,
    Key: file.filename,
    Body: fileStream,
    ContentType: file.mimetype,
    // ACL: 'public-read',
  };
  return new Promise<AWS.S3.ManagedUpload.SendData>((resolve, reject) => {
    s3.upload(bucketParams, function (err, data) {
      if (err) {
        console.log('Error', err);
        reject(err);
      }
      if (data) {
        console.log('Upload Success', data.Location);
        resolve(data);
      }
    });
  });
};
