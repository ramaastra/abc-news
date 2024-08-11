import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  JwtTokenPayload,
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
} from '../models/auth.model';
import { UserResponse } from '../models/user.model';
import { WebResponse } from '../models/web.model';
import { Auth, Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.register(request);
    return { data: result };
  }

  @Post('login')
  @Public()
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<LoginUserResponse>> {
    const result = await this.authService.login(request);
    return { data: result };
  }

  @Get('whoami')
  @Auth()
  async whoAmI(@Req() request: Request): Promise<WebResponse<JwtTokenPayload>> {
    const result = await this.authService.whoAmI(request);
    return { data: result };
  }
}
