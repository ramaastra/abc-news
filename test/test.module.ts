import { Module } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';

@Module({
  imports: [AppModule],
  providers: [TestService],
})
export class TestModule {}
