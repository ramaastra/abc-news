import { Role } from '@prisma/client';
import { UserResponse } from './user.model';

export class RegisterUserRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export class LoginUserRequest {
  email: string;
  password: string;
}

export class LoginUserResponse {
  user: UserResponse;
  token: string;
}
