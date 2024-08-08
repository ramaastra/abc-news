import { z, ZodType } from 'zod';

export class AuthValidation {
  static readonly REGISTER: ZodType = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    username: z
      .string()
      .min(5, { message: 'Username must be 5 or more characters long' })
      .max(15, { message: 'Username must be 15 or fewer characters long' }),
    password: z
      .string()
      .min(6, { message: 'Password must be 6 or more characters long' }),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(['ADMIN', 'USER'], {
      message: 'Role expected to be ADMIN or USER',
    }),
  });
}
