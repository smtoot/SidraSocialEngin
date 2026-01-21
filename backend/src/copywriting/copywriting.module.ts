import { Module } from '@nestjs/common';
import { CopywritingService } from './copywriting.service';
import { CopywritingController } from './copywriting.controller';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [ContentModule],
  controllers: [CopywritingController],
  providers: [CopywritingService],
})
export class CopywritingModule {}