import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import * as crypto from 'crypto';
import { PrismaService } from './prisma.service';

@Injectable()
export class SlugifyService {
  constructor(private prismaService: PrismaService) {}

  async generateNewsCategoryNameSlug(
    newsCategoryName: string,
  ): Promise<string> {
    let slug = this.generateSlug(newsCategoryName);
    const isExist = await this.prismaService.newsCategory.findUnique({
      where: { slug },
    });
    if (isExist) slug += '-' + this.generateRandomChar();
    return slug;
  }

  async generateNewsTitleSlug(newsTitle: string): Promise<string> {
    let slug = this.generateSlug(newsTitle);
    const isExist = await this.prismaService.news.findUnique({
      where: { slug },
    });
    if (isExist) slug += '-' + this.generateRandomChar();
    return slug;
  }

  private generateSlug(text: string): string {
    return slugify(text, {
      remove: /[*+~.()'"!:@]/g,
      lower: true,
    });
  }

  private generateRandomChar(): string {
    return crypto.randomUUID().split('-')[0];
  }
}
