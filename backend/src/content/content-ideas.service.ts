import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentIdea } from './entities/content-idea.entity';
import { ContentCategory } from './entities/content-category.entity';

@Injectable()
export class ContentIdeasService {
  constructor(
    @InjectRepository(ContentIdea)
    private ideasRepository: Repository<ContentIdea>,
    @InjectRepository(ContentCategory)
    private categoriesRepository: Repository<ContentCategory>,
  ) {}

  async generateIdeas(categoryId: string, angle: string, contentType: string): Promise<ContentIdea[]> {
    const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
    if (!category) throw new Error('Category not found');

    const prompt = this.buildAIPrompt(category, angle, contentType);
    const ideas = await this.callOpenAI(prompt, angle, contentType);
    
    const savedIdeas = [];
    for (const idea of ideas) {
      const ideaEntity = this.ideasRepository.create({
        category_id: categoryId,
        content_type: contentType as 'text' | 'image_text' | 'carousel' | 'video',
        angle,
        idea_text: idea.text,
        status: 'draft' as const,
      });
      savedIdeas.push(await this.ideasRepository.save(ideaEntity));
    }
    return savedIdeas;
  }

  async createManualIdea(categoryId: string, angle: string, contentType: string, ideaText: string): Promise<ContentIdea> {
    const idea = this.ideasRepository.create({
      category_id: categoryId,
      content_type: contentType as 'text' | 'image_text' | 'carousel' | 'video',
      angle,
      idea_text: ideaText,
      status: 'draft' as const,
    });
    return this.ideasRepository.save(idea);
  }

  async approveIdea(ideaId: string): Promise<void> {
    await this.ideasRepository.update(ideaId, { status: 'approved' });
  }

  private buildAIPrompt(category: ContentCategory, angle: string, contentType: string): string {
    return `Generate 5 content ideas for category: ${category.name}
    Goal: ${category.primary_goal}
    Audience: ${category.primary_audience}
    Tone: ${category.default_tone.join(', ')}
    Angle: ${angle}
    Content Type: ${contentType}
    Guardrails: ${category.guardrails.join(', ')}
    
    Generate ideas that align with these parameters.`;
  }

  private async callOpenAI(prompt: string, angle: string, contentType: string): Promise<Array<{ text: string }>> {
    // Mock implementation - in production, this would call OpenAI API
    const baseIdeas = {
      'emotional appeal': [
        { text: 'Appeal to parents\' emotions with compelling storytelling' },
        { text: 'Create urgency with relatable parenting challenges' },
        { text: 'Highlight the positive impact of your solution' },
      ],
      'problem-solution': [
        { text: 'Identify common parenting problems and solutions' },
        { text: 'Show before/after scenarios' },
        { text: 'Demonstrate clear benefits and outcomes' },
      ],
      'educational': [
        { text: 'Share valuable tips and insights' },
        { text: 'Provide step-by-step guidance' },
        { text: 'Emphasize educational value and skill development' },
        { text: 'Focus on long-term learning outcomes' },
        { text: 'Highlight safety and reliability' },
      ],
      'storytelling': [
        { text: 'Share relatable family stories and experiences' },
        { text: 'Use cultural references and traditions' },
        { text: 'Create engaging narratives with lessons' },
      ],
    };

    // Select ideas based on angle and content type
    const ideaTemplates = baseIdeas[angle as keyof typeof baseIdeas] || [];
    
    return ideaTemplates.slice(0, 5).map((template, index) => ({
      text: template.text.replace('{{contentType}}', contentType),
    }));
  }
}