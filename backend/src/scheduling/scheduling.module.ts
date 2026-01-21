import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [ContentModule],
  controllers: [SchedulingController],
  providers: [SchedulingService],
})
export class SchedulingModule {}