import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentCategoriesService } from './content-categories.service';
import { ContentIdeasService } from './content-ideas.service';
import { ContentCategoriesController } from './content-ideation.controller';
import { ContentIdeasController } from './content-ideation.controller';
import { ContentCategory } from './entities/content-category.entity';
import { ContentIdea } from './entities/content-idea.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentCategory, ContentIdea]),
  ],
  controllers: [
    ContentCategoriesController,
    ContentIdeasController,
  ],
  providers: [
    ContentCategoriesService,
    ContentIdeasService,
  ],
  exports: [
    ContentCategoriesService,
    ContentIdeasService,
  ],
})
export class ContentIdeationModule {}