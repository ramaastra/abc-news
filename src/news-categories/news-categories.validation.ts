import { z, ZodType } from 'zod';

export class NewsCategoriesValidation {
  static readonly CREATE: ZodType = z.object({
    name: z
      .string({ message: 'Name is required' })
      .max(30, { message: 'Name must be 15 or fewer characters long' }),
    description: z
      .string({ message: 'Description is required' })
      .min(6, { message: 'Description must be 6 or more characters long' }),
  });
}
