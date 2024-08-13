import { Injectable } from '@nestjs/common';
const ImageKit = require('imagekit');

@Injectable()
export class ImageKitService {
  private imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  async upload(file: Express.Multer.File): Promise<string> {
    const { url } = await this.imagekit.upload({
      file: file.buffer.toString('base64'),
      fileName: Date.now() + '-' + file.originalname.replace(/ /g, '-'),
      folder: 'abc-news/images/',
    });
    return url;
  }
}
