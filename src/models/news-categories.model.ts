export class NewsCategoryResponse {
  id: number;
  slug: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export class NewsCategoryRequest {
  name: string;
  description: string;
}
