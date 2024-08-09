import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
} from 'src/models/auth.model';
import { UserResponse } from 'src/models/user.model';
import { WebResponse } from 'src/models/web.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.register(request);
    return { data: result };
  }

  @Post('login')
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<LoginUserResponse>> {
    const result = await this.authService.login(request);
    return { data: result };
  }
}
