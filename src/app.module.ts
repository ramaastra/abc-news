import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { NewsCategoriesModule } from './news-categories/news-categories.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [CommonModule, AuthModule, NewsCategoriesModule, NewsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
