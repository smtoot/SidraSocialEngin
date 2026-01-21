import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentCard } from './entities/content-card.entity';
import { IdeaOption } from './entities/idea-option.entity';
import { ContentCategory } from './entities/content-category.entity';
import { ContentIdea } from './entities/content-idea.entity';
import { ContentPost } from './entities/content-post.entity';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentCard, IdeaOption, ContentCategory, ContentIdea, ContentPost]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}