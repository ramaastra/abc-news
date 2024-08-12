import { NewsCategoryResponse } from './news-categories.model';
import { UserResponse } from './user.model';

export class NewsModel {
  id: number;
  slug: string;
  headline: string;
  content: string;
  pictureUrl?: string;
  isApproved: boolean;
  categoryId: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author: UserResponse;
  category: NewsCategoryResponse;
}

export class NewsResponse {
  id: number;
  slug: string;
  headline: string;
  content: string;
  pictureUrl?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: number;
    slug: string;
    name: string;
  };
  author: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
  };
}

export class CreateNewsRequest {
  headline: string;
  content: string;
  pictureUrl?: string;
  categoryId: number;
}

export class UpdateNewsRequest {
  headline?: string;
  content?: string;
  pictureUrl?: string;
  categoryId?: number;
  isApproved?: boolean;
}
