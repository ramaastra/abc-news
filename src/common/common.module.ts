import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { PrismaService } from './prisma.service';
import { BcryptService } from './bcrypt.service';
import { ValidationService } from './validation.service';
import { SlugifyService } from './slugify.service';

@Global()
@Module({
  providers: [
    PrismaService,
    BcryptService,
    ValidationService,
    SlugifyService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, BcryptService, ValidationService, SlugifyService],
})
export class CommonModule {}
