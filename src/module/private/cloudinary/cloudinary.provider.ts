import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get<string>('cloudinaryName'),
      api_key: configService.get<string>('cloudinaryApiKey'),
      api_secret: configService.get<string>('cloudinarySecret'),
    });
  },
};
