import { Controller, Post, Body } from '@nestjs/common';
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
  async create(
    @Body() request: NewsCategoryRequest,
  ): Promise<WebResponse<NewsCategoryResponse>> {
    const result = await this.newsCategoriesService.create(request);
    return { data: result };
  }
}
