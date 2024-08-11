export class NewsCategoryResponse {
  id: number;
  slug: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateNewsCategoryRequest {
  name: string;
  description: string;
}
