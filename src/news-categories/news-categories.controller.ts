import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Auth, Public } from '../auth/auth.decorator';
import { WebResponse } from '../models/web.model';
import {
  NewsCategoryRequest,
  NewsCategoryResponse,
} from '../models/news-categories.model';
import { NewsCategoriesService } from './news-categories.service';

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
  @Public()
  async findAll(): Promise<WebResponse<NewsCategoryResponse[]>> {
    const result = await this.newsCategoriesService.findAll();
    return { data: result };
  }

  @Get(':id')
  @Public()
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<NewsCategoryResponse>> {
    const result = await this.newsCategoriesService.findOne(id);
    return { data: result };
  }
}
