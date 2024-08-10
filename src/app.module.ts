import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { NewsCategoriesModule } from './news-categories/news-categories.module';

@Module({
  imports: [CommonModule, AuthModule, NewsCategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
