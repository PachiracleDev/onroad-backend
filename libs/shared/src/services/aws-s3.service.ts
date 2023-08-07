import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from '../../../../config';
import * as sharp from 'sharp';

import { sanitizeKey, uuid } from '../utils/generateKey';

@Injectable()
export class S3Service {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {}

  async uploadFile(key: string, file: Buffer) {
    const s3 = new S3Client({
      region: this.configService.aws.s3.region,
      credentials: {
        accessKeyId: this.configService.aws.s3.accessKeyId,
        secretAccessKey: this.configService.aws.s3.secretAccessKey,
      },
    });
    const params = new PutObjectCommand({
      Body: file,
      Bucket: this.configService.aws.s3.bucketName,
      Key: key,
    });
    await s3.send(params);
  }

  async uploadBus(file: Express.Multer.File) {
    const key = `bus/${uuid()}/${sanitizeKey(file.originalname)}`;

    const buffer = await sharp(file.buffer)
      .resize(250)
      .toFormat('png')
      .toBuffer();

    await this.uploadFile(key, buffer);

    // TIENE UN CDN PARA MEJORAR EL RENDIMIENTO, CON EL CACHE DE 24H
    return `https://${this.configService.aws.cloudfront.domain}/${key}`;
  }
}
