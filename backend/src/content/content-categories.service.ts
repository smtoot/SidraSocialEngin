import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentCategory } from './entities/content-category.entity';

@Injectable()
export class ContentCategoriesService {
  constructor(
    @InjectRepository(ContentCategory)
    private categoriesRepository: Repository<ContentCategory>,
  ) {}

  async findAll(): Promise<ContentCategory[]> {
    return this.categoriesRepository.find({ where: { is_active: true } });
  }

  async findOne(id: string): Promise<ContentCategory | null> {
    return this.categoriesRepository.findOne({ where: { id, is_active: true } });
  }

  async create(categoryData: Partial<ContentCategory>): Promise<ContentCategory> {
    const category = this.categoriesRepository.create({
      ...categoryData,
      default_tone: ['calm', 'educational', 'professional', 'reassuring', 'motivational'],
      default_content_types: ['text', 'image_text'],
      angles: ['emotional appeal', 'problem-solution', 'benefit-feature', 'storytelling'],
      guardrails: ['No offensive content', 'Ensure brand alignment', 'Include call-to-action'],
      priority: 'medium',
      is_active: true,
    });
    return this.categoriesRepository.save(category);
  }

  async update(id: string, categoryData: Partial<ContentCategory>): Promise<ContentCategory | null> {
    await this.categoriesRepository.update(id, categoryData);
    return this.findOne(id);
  }

  async getSummary(): Promise<Array<{ category: ContentCategory; ideasCount: number; approvedCount: number; publishedCount: number }>> {
    const categories = await this.categoriesRepository.find({ where: { is_active: true } });
    
    // Return basic summary for now - counters will be integrated with content ideas
    return Promise.all(categories.map(async (category) => {
      return {
        category,
        ideasCount: 0,
        approvedCount: 0,
        publishedCount: 0,
      };
    }));
  }
}