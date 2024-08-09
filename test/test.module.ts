import { Module } from '@nestjs/common';
import { CommonModule } from '../src/common/common.module';
import { AuthModule } from '../src/auth/auth.module';
import { TestService } from './test.service';

@Module({
  imports: [CommonModule, AuthModule],
  providers: [TestService],
})
export class TestModule {}
