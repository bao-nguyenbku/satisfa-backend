import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './dto/cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    console.log(
      '🚀 ~ file: cloudinary.service.ts:9 ~ CloudinaryService ~ uploadFile ~ file:',
      file,
    );
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
