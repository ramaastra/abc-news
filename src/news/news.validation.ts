import { z, ZodType } from 'zod';

export class NewsValidation {
  static readonly CREATE: ZodType = z.object({
    headline: z
      .string({ message: 'Headline is required' })
      .min(5, { message: 'Headline must be 5 or more characters long' })
      .max(60, { message: 'Headline must be 15 or fewer characters long' }),
    content: z
      .string({ message: 'Content is required' })
      .min(5, { message: 'Content must be 5 or more characters long' }),
    pictureUrl: z.string().url('Invalid picture URL').optional(),
    categoryId: z.number({ message: 'Category is required' }),
  });

  static readonly UPDATE: ZodType = z.object({
    headline: z
      .string({ message: 'Headline is required' })
      .min(5, { message: 'Headline must be 5 or more characters long' })
      .max(60, { message: 'Headline must be 15 or fewer characters long' })
      .optional(),
    content: z
      .string({ message: 'Content is required' })
      .min(5, { message: 'Content must be 5 or more characters long' })
      .optional(),
    pictureUrl: z.string().url('Invalid picture URL').optional().optional(),
    categoryId: z.number({ message: 'Category is required' }).optional(),
    isApproved: z.boolean().optional(),
  });
}
