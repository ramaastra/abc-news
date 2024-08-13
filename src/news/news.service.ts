import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { SlugifyService } from '../common/slugify.service';
import { ImageKitService } from '../common/imagekit.service';
import { ValidationService } from '../common/validation.service';
import {
  CreateNewsRequest,
  NewsModel,
  NewsResponse,
  UpdateNewsRequest,
} from '../models/news.model';
import { UserResponse } from '../models/user.model';
import { NewsValidation } from './news.validation';

@Injectable()
export class NewsService {
  constructor(
    private prismaService: PrismaService,
    private slugifyService: SlugifyService,
    private imageKitService: ImageKitService,
    private validationService: ValidationService,
  ) {}

  private formatNewsData(news: NewsModel): NewsResponse {
    return {
      id: news.id,
      slug: news.slug,
      headline: news.headline,
      content: news.content,
      pictureUrl: news.pictureUrl,
      isApproved: news.isApproved,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
      category: {
        id: news.category.id,
        slug: news.category.slug,
        name: news.category.name,
      },
      author: {
        id: news.author.id,
        username: news.author.username,
        firstName: news.author.firstName,
        lastName: news.author.lastName,
      },
    };
  }

  async create(
    user: UserResponse,
    request: CreateNewsRequest,
    file?: Express.Multer.File,
  ): Promise<NewsResponse> {
    if (file) {
      const pictureUrl = await this.imageKitService.upload(file);
      request.pictureUrl = pictureUrl;
    }

    const newsRequest: CreateNewsRequest = this.validationService.validate(
      NewsValidation.CREATE,
      { ...request, categoryId: +request.categoryId },
    );

    const isCategoryExist = await this.prismaService.newsCategory.findUnique({
      where: { id: newsRequest.categoryId },
    });
    if (!isCategoryExist) {
      throw new HttpException('Invalid category', 400);
    }

    const slug = await this.slugifyService.generateNewsTitleSlug(
      newsRequest.headline,
    );

    const news = await this.prismaService.news.create({
      data: {
        slug,
        headline: newsRequest.headline,
        content: newsRequest.content,
        pictureUrl: newsRequest.pictureUrl,
        categoryId: newsRequest.categoryId,
        authorId: user.id,
      },
      include: {
        category: true,
        author: true,
      },
    });
    return this.formatNewsData(news);
  }

  async findAll(
    authorUsername?: string,
    newsCategory?: string,
  ): Promise<NewsResponse[]> {
    const news = await this.prismaService.news.findMany({
      where: {
        author: { username: authorUsername },
        category: { slug: newsCategory },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        author: true,
      },
    });
    return news.map((data) => this.formatNewsData(data));
  }

  async findOne(slug: string): Promise<NewsResponse> {
    const news = await this.prismaService.news.findUnique({
      where: { slug },
      include: {
        category: true,
        author: true,
      },
    });
    if (!news) {
      throw new HttpException('Invalid news URL', 404);
    }
    return this.formatNewsData(news);
  }

  async update(
    user: UserResponse,
    id: number,
    request: UpdateNewsRequest,
    file?: Express.Multer.File,
  ): Promise<NewsResponse> {
    if (file) {
      const pictureUrl = await this.imageKitService.upload(file);
      request.pictureUrl = pictureUrl;
    }

    const updateNewsRequest: UpdateNewsRequest =
      this.validationService.validate(NewsValidation.UPDATE, {
        ...request,
        categoryId: +request.categoryId,
      });

    const news = await this.prismaService.news.findUnique({
      where: { id },
    });
    if (!news) {
      throw new HttpException(`News with id ${id} does not exist`, 400);
    }

    if (user.role === 'ADMIN' && updateNewsRequest.isApproved !== undefined) {
      const updatedNews = await this.prismaService.news.update({
        where: { id },
        data: { isApproved: updateNewsRequest.isApproved },
        include: {
          category: true,
          author: true,
        },
      });
      return this.formatNewsData(updatedNews);
    } else if (user.role === 'ADMIN') {
      throw new HttpException(
        'Could not manage the corresponding news content',
        403,
      );
    }

    if (user.id !== news.authorId) {
      throw new HttpException(
        'Could not manage the corresponding news content',
        403,
      );
    }

    if (updateNewsRequest.categoryId) {
      const isExist = await this.prismaService.newsCategory.findUnique({
        where: { id: updateNewsRequest.categoryId },
      });
      if (!isExist) {
        throw new HttpException(
          `Category with id ${updateNewsRequest.categoryId} does not exist`,
          400,
        );
      }
    }

    if (
      updateNewsRequest.headline &&
      updateNewsRequest.headline !== news.headline
    ) {
      const slug = await this.slugifyService.generateNewsTitleSlug(
        updateNewsRequest.headline,
      );
      updateNewsRequest['slug'] = slug;
    }

    delete updateNewsRequest?.isApproved;
    const updatedNews = await this.prismaService.news.update({
      where: { id },
      data: updateNewsRequest,
      include: {
        category: true,
        author: true,
      },
    });
    return this.formatNewsData(updatedNews);
  }

  async remove(user: UserResponse, id: number): Promise<boolean> {
    const news = await this.prismaService.news.findUnique({
      where: { id },
    });
    if (!news) {
      throw new HttpException(`News with id ${id} does not exist`, 400);
    }
    if (user.id !== news.authorId) {
      throw new HttpException(
        'Could not manage the corresponding news content',
        403,
      );
    }

    await this.prismaService.news.delete({
      where: { id },
    });
    return true;
  }
}
