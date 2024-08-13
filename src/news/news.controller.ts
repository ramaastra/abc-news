import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth, Public, User } from '../auth/auth.decorator';
import { WebResponse } from '../models/web.model';
import {
  CreateNewsRequest,
  NewsResponse,
  UpdateNewsRequest,
} from '../models/news.model';
import { UserResponse } from '../models/user.model';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @Auth('USER')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @User() user: UserResponse,
    @Body() request: CreateNewsRequest,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<WebResponse<NewsResponse>> {
    const result = await this.newsService.create(user, request, file);
    return { data: result };
  }

  @Get()
  @Public()
  async findAll(
    @Query('author') authorUsername?: string,
    @Query('category') newsCategory?: string,
  ): Promise<WebResponse<NewsResponse[]>> {
    const result = await this.newsService.findAll(authorUsername, newsCategory);
    return { data: result };
  }

  @Get(':slug')
  @Public()
  async findOne(
    @Param('slug') slug: string,
  ): Promise<WebResponse<NewsResponse>> {
    const result = await this.newsService.findOne(slug);
    return { data: result };
  }

  @Patch(':id')
  @Auth()
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @User() user: UserResponse,
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateNewsRequest,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<WebResponse<NewsResponse>> {
    const result = await this.newsService.update(user, id, request, file);
    return { data: result };
  }

  @Delete(':id')
  @Auth()
  async remove(
    @User() user: UserResponse,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<boolean>> {
    const result = await this.newsService.remove(user, id);
    return { data: result };
  }
}
