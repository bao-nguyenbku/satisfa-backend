import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { NotFoundException } from '@nestjs/common/exceptions';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('uploads')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  @UseInterceptors(
    FileInterceptor(
      'file',
      // {
      //   storage: diskStorage({
      //     destination: './uploads',
      //     filename: (req, file, cb) => {
      //       const filename: string = uuidv4();
      //       const extension = file.mimetype.split('/').at(-1);

      //       cb(null, `${filename}.${extension}`);
      //     },
      //   }),
      // }
    ),
  )
  @Post()
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }

  // @Get(':fileId')
  // getFile(@Param('fileId') fileId: string, @Res() res) {
  //   const filePath = join(process.cwd(), `/uploads/${fileId}`);
  //   if (fs.existsSync(filePath)) {
  //     const file = createReadStream(filePath);
  //     file.pipe(res);
  //   } else {
  //     throw new NotFoundException('The file is not existed');
  //   }
  // }

  @Delete(':fileId')
  deleteFile(@Param('fileId') fileId: string) {
    return fileId;
    // fs.unlink(`${process.cwd()}/uploads/${fileId}`, (err) => {
    //   if (err) {
    //     res.status(HttpStatus.BAD_REQUEST).json({
    //       statusCode: HttpStatus.BAD_REQUEST,
    //       path: req.url,
    //       type: 'error',
    //       message: err,
    //     });
    //     return;
    //   }
    //   res.status(HttpStatus.CREATED).json({
    //     statusCode: HttpStatus.CREATED,
    //     message: 'This file is deleted',
    //   });
    // });
  }
}
