import { Global, Module } from '@nestjs/common';
import { ErrorFilter } from './error.filter';
import { PrismaService } from './prisma.service';
import { BcryptService } from './bcrypt.service';

@Global()
@Module({
  providers: [ErrorFilter, PrismaService, BcryptService],
  exports: [PrismaService, BcryptService],
})
export class CommonModule {}
