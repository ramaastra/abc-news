import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import { BcryptService } from '../src/common/bcrypt.service';

@Injectable()
export class TestService {
  constructor(
    private prismaService: PrismaService,
    private bcryptService: BcryptService,
  ) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'user_test',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        email: 'testuser@gmail.com',
        username: 'user_test',
        firstName: 'User',
        lastName: 'Test',
        password: await this.bcryptService.generateHash('123456'),
        role: 'USER',
      },
    });
  }
}
