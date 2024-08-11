import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { SlugifyService } from '../common/slugify.service';
import { ValidationService } from '../common/validation.service';
import {
  CreateNewsCategoryRequest,
  NewsCategoryResponse,
} from '../models/news-categories.model';
import { NewsCategoriesValidation } from './news-categories.validation';

@Injectable()
export class NewsCategoriesService {
  constructor(
    private prismaService: PrismaService,
    private slugifyService: SlugifyService,
    private validationService: ValidationService,
  ) {}

  async create(
    request: CreateNewsCategoryRequest,
  ): Promise<NewsCategoryResponse> {
    const newsCategoryRequest: CreateNewsCategoryRequest =
      this.validationService.validate(NewsCategoriesValidation.CREATE, request);

    const isExist = await this.prismaService.newsCategory.findUnique({
      where: { name: newsCategoryRequest.name },
    });
    if (isExist) {
      throw new HttpException(
        `Category '${newsCategoryRequest.name}' is already exist`,
        400,
      );
    }

    const slug = await this.slugifyService.generateNewsCategoryNameSlug(
      newsCategoryRequest.name,
    );
    return this.prismaService.newsCategory.create({
      data: {
        ...newsCategoryRequest,
        slug,
      },
    });
  }

  async findAll(): Promise<NewsCategoryResponse[]> {
    const newsCategories = await this.prismaService.newsCategory.findMany();
    return newsCategories;
  }

  async findOne(id: number): Promise<NewsCategoryResponse> {
    const newsCategory = await this.prismaService.newsCategory.findUnique({
      where: { id },
    });
    if (!newsCategory) {
      throw new HttpException(`Category with id ${id} does not exist`, 400);
    }
    return newsCategory;
  }
}
