import { Injectable } from '@nestjs/common';
import { ContentService } from '../content/content.service';
import { ComposeCopyDto } from '../content/dto/content.dto';

@Injectable()
export class CopywritingService {
  constructor(
    private readonly contentService: ContentService,
  ) {}

  async composeCopy(request: ComposeCopyDto): Promise<{ copyText: string }> {
    const copyText = await this.generateAICopy(
      request.ideaTextSeed,
      request.tone,
      request.cultureContext,
    );

    await this.contentService.updateContentCard(request.cardId, {
      copy_text: copyText,
      tone: request.tone,
      culture_context: request.cultureContext,
      is_manual_copy: false,
    });

    return { copyText };
  }

  async createManualCopy(
    cardId: string,
    copyText: string,
    authorId: string,
    authorName: string,
  ): Promise<void> {
    const contentCard = await this.contentService.getContentCard(cardId);
    
    if (!contentCard) {
      throw new Error('Content card not found');
    }

    await this.contentService.updateContentCard(cardId, {
      copy_text: copyText,
      tone: 'manual',
      culture_context: 'manual',
      author_id: authorId,
      author_name: authorName,
      is_manual_copy: true,
      status: 'Draft',
    });
  }

  async approveCopy(cardId: string, edits?: string): Promise<void> {
    if (!cardId) {
      throw new Error('Card ID is required');
    }
    
    const contentCard = await this.contentService.getContentCard(cardId);
    
    if (!contentCard) {
      throw new Error('Content card not found');
    }
    
    const finalCopyText = edits || contentCard.copy_text || '';
    const finalTone = contentCard.tone || 'friendly';
    const finalCultureContext = contentCard.culture_context || 'sudanese';
    
    await this.contentService.updateCopyText(
      cardId,
      finalCopyText,
      finalTone,
      finalCultureContext,
    );
  }

  private async generateAICopy(
    ideaSeed: string,
    tone: string,
    cultureContext: string,
  ): Promise<string> {
    const toneMap = {
      friendly: 'ودودة',
      professional: 'احترافية',
      creative: 'إبداعية',
      formal: 'رسمية',
    };

    const cultureMap = {
      sudanese: 'سودانية',
      british: 'بريطانية',
      hybrid: 'هجين',
    };

    return `بناءً على فكرة "${ideaSeed}"، هنا مسودة بنبرة ${toneMap[tone]} وسياق ${cultureMap[cultureContext]}:

📝 **نص مقترح:**

مرحباً جميعاً! 🌟

مع بداية العام الدراسي الجديد، نود مشاركة بعض النصائح القيمة التي ستساعدكم على تحقيق أقصى استفادة من رحلتكم التعليمية. الاستعداد الجيد هو مفتاح النجاح، ونحن هنا لدعمكم في كل خطوة.

تذكروا أن كل طالب لديه إمكانيات فريدة، والهدف هو استكشافها وتطويرها بالشكل الأمثل. لذا، احرصوا على تنظيم وقتكم، ووضع أهداف واضحة، وطلب المساعدة عند الحاجة.

نتمنى للجميع عاماً دراسياً مليئاً بالنجاح والإنجازات! 🎓✨

#بداية_العام_الدراسي #نجاح #تعليم`;
  }
}