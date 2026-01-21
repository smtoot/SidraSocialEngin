import { Module } from '@nestjs/common';
import { IdeationService } from './ideation.service';
import { IdeationController } from './ideation.controller';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [ContentModule],
  controllers: [IdeationController],
  providers: [IdeationService],
})
export class IdeationModule {}