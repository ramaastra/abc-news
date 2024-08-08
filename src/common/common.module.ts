import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { BcryptService } from './bcrypt.service';

@Global()
@Module({
  providers: [PrismaService, BcryptService],
  exports: [PrismaService, BcryptService],
})
export class CommonModule {}
