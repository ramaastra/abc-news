import { Role } from '@prisma/client';

export class RegisterUserRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}
