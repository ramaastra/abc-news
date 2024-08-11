import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';
import { BcryptService } from '../common/bcrypt.service';
import { ValidationService } from '../common/validation.service';
import {
  JwtTokenPayload,
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
} from '../models/auth.model';
import { UserResponse } from '../models/user.model';
import { AuthValidation } from './auth.validation';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private bcryptService: BcryptService,
    private validationService: ValidationService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    const registerUserRequest: RegisterUserRequest =
      this.validationService.validate(AuthValidation.REGISTER, request);

    const isExist = await this.prismaService.user.count({
      where: {
        OR: [
          { email: registerUserRequest.email },
          { username: registerUserRequest.username },
        ],
      },
    });
    if (isExist) {
      throw new HttpException(
        'Email or username already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    registerUserRequest.password = await this.bcryptService.generateHash(
      registerUserRequest.password,
    );
    return this.prismaService.user.create({
      data: registerUserRequest,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async login(request: LoginUserRequest): Promise<LoginUserResponse> {
    const loginUserRequest: LoginUserRequest = this.validationService.validate(
      AuthValidation.LOGIN,
      request,
    );

    const user = await this.prismaService.user.findUnique({
      where: { email: loginUserRequest.email },
    });
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordMatched = await this.bcryptService.compareHash(
      loginUserRequest.password,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete user.password;

    const token = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });

    return { user, token };
  }

  async whoAmI(@Req() request: Request): Promise<JwtTokenPayload> {
    const user = request['user'];
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
