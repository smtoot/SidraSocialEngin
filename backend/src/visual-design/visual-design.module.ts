import { Module } from '@nestjs/common';
import { VisualDesignService } from './visual-design.service';
import { VisualDesignController } from './visual-design.controller';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [ContentModule],
  controllers: [VisualDesignController],
  providers: [VisualDesignService],
})
export class VisualDesignModule {}