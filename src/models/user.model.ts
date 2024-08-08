import { Role } from '@prisma/client';

export class UserResponse {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
