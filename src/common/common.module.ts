import { Global, Module } from '@nestjs/common';
import { ErrorFilter } from './error.filter';
import { PrismaService } from './prisma.service';
import { BcryptService } from './bcrypt.service';
import { ValidationService } from './validation.service';

@Global()
@Module({
  providers: [ErrorFilter, PrismaService, BcryptService, ValidationService],
  exports: [PrismaService, BcryptService, ValidationService],
})
export class CommonModule {}
