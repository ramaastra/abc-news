import { Injectable } from '@nestjs/common';
import { NewsCategory, Role } from '@prisma/client';
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

  async createUser(role: Role = 'USER') {
    await this.prismaService.user.create({
      data: {
        email: 'testuser@gmail.com',
        username: 'user_test',
        firstName: 'User',
        lastName: 'Test',
        password: await this.bcryptService.generateHash('123456'),
        role,
      },
    });
  }

  async deleteNewsCategory() {
    await this.prismaService.newsCategory.deleteMany({
      where: { name: 'Test Category' },
    });
  }

  async createNewsCategory() {
    await this.prismaService.newsCategory.create({
      data: {
        slug: 'test-category',
        name: 'Test Category',
        description: 'This is just a dummy category used for testing purpose',
      },
    });
  }

  async getNewsCategory(): Promise<NewsCategory> {
    return await this.prismaService.newsCategory.findUnique({
      where: { name: 'Test Category' },
    });
  }
}
