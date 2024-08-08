import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { BcryptService } from 'src/common/bcrypt.service';
import { ValidationService } from 'src/common/validation.service';
import { RegisterUserRequest } from 'src/models/auth.model';
import { UserResponse } from 'src/models/user.model';
import { AuthValidation } from './auth.validation';

@Injectable()
export class AuthService {
  constructor(
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
}
