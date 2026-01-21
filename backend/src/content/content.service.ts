import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentCard } from './entities/content-card.entity';
import { IdeaOption } from './entities/idea-option.entity';
import { CreateContentCardDto } from './dto/content.dto';
import { ContentCategory } from './entities/content-category.entity';
import { ContentIdea } from './entities/content-idea.entity';
import { ContentPost } from './entities/content-post.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentCard)
    private contentCardRepository: Repository<ContentCard>,
    @InjectRepository(IdeaOption)
    private ideaOptionRepository: Repository<IdeaOption>,
    @InjectRepository(ContentCategory)
    private contentCategoryRepository: Repository<ContentCategory>,
    @InjectRepository(ContentIdea)
    private contentIdeaRepository: Repository<ContentIdea>,
    @InjectRepository(ContentPost)
    private contentPostRepository: Repository<ContentPost>,
  ) {}

  async createContentCard(createDto: CreateContentCardDto): Promise<ContentCard> {
    const contentCard = this.contentCardRepository.create({
      topic: createDto.topic,
      platform: createDto.platform,
    });
    
    return this.contentCardRepository.save(contentCard);
  }

  async getContentCard(id: string): Promise<ContentCard> {
    return this.contentCardRepository.findOne({
      where: { id },
      relations: ['ideas'],
    });
  }

  async updateContentCard(id: string, updates: Partial<ContentCard>): Promise<ContentCard> {
    await this.contentCardRepository.update(id, updates);
    return this.getContentCard(id);
  }

  async createIdeaOptions(cardId: string, ideas: Array<{ text: string; rationale: string }>): Promise<IdeaOption[]> {
    const ideaOptions = ideas.map(idea => 
      this.ideaOptionRepository.create({
        topic_id: cardId,
        text: idea.text,
        rationale: idea.rationale,
      })
    );
    
    return this.ideaOptionRepository.save(ideaOptions);
  }

  async createManualIdea(
    cardId: string, 
    text: string, 
    rationale: string,
    authorId?: string,
    authorName?: string
  ): Promise<IdeaOption> {
    const ideaOption = this.ideaOptionRepository.create({
      topic_id: cardId,
      text,
      rationale,
      author_id: authorId,
      author_name: authorName,
      is_manual: true,
    });
    
    return this.ideaOptionRepository.save(ideaOption);
  }

  async selectIdea(cardId: string, ideaId: string): Promise<void> {
    await this.contentCardRepository.update(cardId, {
      selected_idea_id: ideaId,
    });
  }

  async updateCopyText(cardId: string, copyText: string, tone: string, cultureContext: string): Promise<void> {
    await this.contentCardRepository.update(cardId, {
      copy_text: copyText,
      tone,
      culture_context: cultureContext,
      status: 'UnderReview',
    });
  }

  async addToLibrary(cardId: string): Promise<void> {
    await this.contentCardRepository.update(cardId, {
      status: 'InLibrary',
    });
  }

  async getContentLibrary(): Promise<ContentCard[]> {
    // Return all content cards currently in library
    return this.contentCardRepository.find({ where: { status: 'InLibrary' }, relations: ['ideas'] });
  }

  async getModerationQueue(): Promise<ContentCard[]> {
    // Return all content cards pending moderation
    return this.contentCardRepository.find({ 
      where: { 
        status: 'UnderReview',
        moderation_status: 'Pending' 
      },
      relations: ['ideas'] 
    });
  }

  async approveContent(cardId: string): Promise<void> {
    const card = await this.contentCardRepository.findOne({ where: { id: cardId } });
    if (!card) return;

    const auditEntry = {
      action: 'تمت الموافقة على المحتوى',
      timestamp: new Date().toISOString(),
      user: 'Admin',
      details: `تمت الموافقة على المحتوى: ${card.topic}`,
    };

    card.moderation_status = 'Approved';
    card.status = 'Scheduled';
    if (Array.isArray(card.audit_trail)) {
      card.audit_trail = [...card.audit_trail, auditEntry];
    } else {
      card.audit_trail = [auditEntry];
    }
    
    await this.contentCardRepository.save(card);
  }

  async rejectContent(cardId: string, reason: string): Promise<void> {
    const card = await this.contentCardRepository.findOne({ where: { id: cardId } });
    if (!card) return;

    const auditEntry = {
      action: 'تم رفض المحتوى',
      timestamp: new Date().toISOString(),
      user: 'Admin',
      details: `رفض المحتوى: ${card.topic} - السبب: ${reason}`,
    };

    card.moderation_status = 'Rejected';
    card.status = 'Rejected';
    card.moderation_reason = reason;
    if (Array.isArray(card.audit_trail)) {
      card.audit_trail = [...card.audit_trail, auditEntry];
    } else {
      card.audit_trail = [auditEntry];
    }
    
    await this.contentCardRepository.save(card);
  }
}
