import { Injectable } from '@nestjs/common';
import { ContentService } from '../content/content.service';
import { CreateContentCardDto } from '../content/dto/content.dto';

@Injectable()
export class IdeationService {
  constructor(
    private readonly contentService: ContentService,
  ) {}

  async generateIdeas(topic: string): Promise<{ cardId: string; ideas: any[] }> {
    const contentCard = await this.contentService.createContentCard({
      topic,
      platform: 'facebook',
    });

    const ideas = await this.generateAIIdeas(topic);

    await this.contentService.createIdeaOptions(
      contentCard.id,
      ideas,
    );

    return {
      cardId: contentCard.id,
      ideas: ideas.map((idea, index) => ({
        id: `idea-${index}`,
        topic_id: contentCard.id,
        text: idea.text,
        rationale: idea.rationale,
      })),
    };
  }

  async createManualIdea(cardId: string, idea: any): Promise<{ cardId: string; ideas: any[] }> {
    let contentCard = await this.contentService.getContentCard(cardId);
    
    if (!contentCard) {
      contentCard = await this.contentService.createContentCard({
        topic: idea.text?.substring(0, 100) || 'فكرة يدوية',
        platform: 'facebook',
      });
    }

    const savedIdea = await this.contentService.createManualIdea(
      contentCard.id,
      idea.text,
      idea.rationale,
      idea.authorId,
      idea.authorName,
    );

    await this.contentService.updateContentCard(contentCard.id, {
      author_id: idea.authorId,
      author_name: idea.authorName,
      is_manual_idea: true,
    });

    return {
      cardId: contentCard.id,
      ideas: [{
        id: savedIdea.id,
        topic_id: contentCard.id,
        text: savedIdea.text,
        rationale: savedIdea.rationale,
        author_id: savedIdea.author_id,
        author_name: savedIdea.author_name,
        is_manual: true,
      }],
    };
  }

  async selectIdea(cardId: string, ideaId: string): Promise<void> {
    await this.contentService.selectIdea(cardId, ideaId);
  }

  private async generateAIIdeas(topic: string): Promise<Array<{ text: string; rationale: string }>> {
    return [
      {
        text: `نصائح عملية للطلاب في بداية العام الدراسي`,
        rationale: 'محتوى تعليمي مفيد يساعد الطلاب على الاستعداد للعام الجديد',
      },
      {
        text: `رسالة موجهة لأولياء الأمور حول أهمية المشاركة`,
        rationale: 'بناء جسر تواصل مع العائلة لضمان نجاح الطلاب',
      },
      {
        text: 'عرض خاص على المستلزمات الدراسية للعام الجديد',
        rationale: 'محفز تجاري يشجع على الشراء والمشاركة',
      },
      {
        text: 'قصة نجاح طالب متفوق في العام الماضي',
        rationale: 'إلهام الطلاب وتحفيزهم لتحقيق النجاح',
      },
      {
        text: 'دليل للأنشطة اللامنهجية والرياضية',
        rationale: 'توسيع آفاق الطلاب بما وراء المنهج الدراسي',
      },
    ];
  }
}