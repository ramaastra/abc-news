import { Controller, Get, Post, Body } from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { NewsCategoriesService } from './news-categories.service';
import { WebResponse } from '../models/web.model';
import {
  NewsCategoryRequest,
  NewsCategoryResponse,
} from '../models/news-categories.model';

@Controller('news/categories')
export class NewsCategoriesController {
  constructor(private readonly newsCategoriesService: NewsCategoriesService) {}

  @Post()
  @Auth('ADMIN')
  async create(
    @Body() request: NewsCategoryRequest,
  ): Promise<WebResponse<NewsCategoryResponse>> {
    const result = await this.newsCategoriesService.create(request);
    return { data: result };
  }

  @Get()
  async findAll(): Promise<WebResponse<NewsCategoryResponse[]>> {
    const result = await this.newsCategoriesService.findAll();
    return { data: result };
  }
}
