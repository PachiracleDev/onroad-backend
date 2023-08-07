import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';

import { S3Service } from '../services/aws-s3.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../guards/auth.guard';

@Controller('aws-s3')
@UseGuards(AuthGuard)
export class S3Controller {
  constructor(private awsS3Service: S3Service) {}

  @Post('bus')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatarFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'jpg|jpeg|png' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<string> {
    return await this.awsS3Service.uploadBus(file);
  }
}
