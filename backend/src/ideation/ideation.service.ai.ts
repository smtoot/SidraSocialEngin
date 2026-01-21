import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContentService } from '../content/content.service';
import { CreateContentCardDto } from '../content/dto/content.dto';

@Injectable()
export class IdeationService {
  constructor(
    private readonly contentService: ContentService,
    private readonly configService: ConfigService,
  ) {}

  async generateIdeas(topic: string): Promise<{ cardId: string; ideas: any[] }> {
    // Create content card first
    const contentCard = await this.contentService.createContentCard({
      topic,
      platform: 'facebook',
    });

    // Get OpenAI API key
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    let ideas;
    
    if (apiKey && apiKey !== 'your-openai-api-key-here') {
      // Use real AI generation
      ideas = await this.generateRealAIIdeas(topic, apiKey);
    } else {
      // Fallback to mock implementation
      ideas = await this.generateMockIdeas(topic);
    }

    // Save ideas to database
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

  async selectIdea(cardId: string, ideaId: string): Promise<void> {
    await this.contentService.selectIdea(cardId, ideaId);
  }

  private async generateRealAIIdeas(topic: string, apiKey: string): Promise<Array<{ text: string; rationale: string }>> {
    try {
      // Import OpenAI dynamically
      const { Configuration, OpenAIApi } = require('openai');
      
      const configuration = new Configuration({
        apiKey,
      });
      
      const openai = new OpenAIApi(configuration);

      const prompt = `أنا منصة "سدرة" لإنتاج المحتوى الإعلامي والاجتماعي للمجتمع العربي.

أريد منك 5 أفكار محتوى إبداعية ومتنوعة للموضوع التالي: "${topic}"

الجمهور المستهدف:
- المستخدمون العربي (18-45 سنة)
- المهتمون بالتعليم والتطوير الذاتي
- المجتمع السوداني بشكل خاص

المنصات المستهدفة:
- فيسبوك (المحتوى الأساسي)
- إنستغرام (محتوى بصري)
- تويتر (محتوى سريع ومختصر)

لكل فكرة، أرجع:
1. **العنوان**: جملة جذابة ومختصرة (20-30 كلمة)
2. **الوصف**: شرح بسيط وواضح
3. **السبب**: لماذا هذه الفكرة فعالة ومهمة
4. **النبرة**: ودودة، احترافية، إبداعية
5. **الصيغة التفيذية**: نص، صور، فيديو، استطلاعة
6. **الهاشتاج**: 3-5 وسوم لزيادة التفاعل

الرجاء الرد بصيغة JSON:

{
  "ideas": [
    {
      "title": "عنوان الفكرة",
      "description": "وصف موجز",
      "rationale": "سبب الأهمية",
      "tone": "ودودة/احترافية/إبداعية",
      "format": "نص/صورة/فيديو",
      "hashtags": ["#هاشتاج_1", "#هاشتاج_2"]
    }
  ]
}

ملاحظات:
- اجعل الأفكار مناسبة للثقافة العربية والسياق السوداني
- ركز على القيمة العملية والفائدة للمجتمع
- تجنب الأفكار المنسوخة أو العامة جداً`;

      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      });

      const response = completion.data.choices[0].message.content;
      
      // Parse the AI response
      const parsedResponse = this.parseAIResponse(response);
      
      return parsedResponse.ideas.map((idea: any) => ({
        text: idea.title,
        rationale: idea.rationale,
      }));
    } catch (error) {
      console.error('OpenAI API Error:', error);
      // Fallback to mock if AI fails
      return this.generateMockIdeas(topic).ideas;
    }
  }

  private generateMockIdeas(topic: string): { ideas: Array<{ text: string; rationale: string }> } {
    const mockIdeas = [
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
    
    return { ideas: mockIdeas };
  }

  private parseAIResponse(response: string): { ideas: any[] } {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response);
      return parsed;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Fallback: try to extract ideas from plain text
      return this.extractIdeasFromText(response);
    }
  }

  private extractIdeasFromText(text: string): { ideas: any[] } {
    const ideas = [];
    const lines = text.split('\n');
    
    let currentIdea = null;
    
    for (const line of lines) {
      if (line.includes('العنوان:') || line.includes('Title:')) {
        if (currentIdea) {
          ideas.push(currentIdea);
        }
        const title = line.replace(/العنوان:|Title:/i, '').trim();
        currentIdea = { title: '', rationale: '' };
      } else if (line.includes('السبب:') || line.includes('Rationale:')) {
        if (currentIdea) {
          currentIdea.rationale = line.replace(/السبب:|Rationale:/i, '').trim();
        }
      }
    }
    
    if (currentIdea) {
      ideas.push(currentIdea);
    }
    
    // Fallback to mock if parsing fails completely
    if (ideas.length === 0) {
      return this.generateMockIdeas('');
    }
    
    return { ideas };
  }
}