import { Injectable } from '@nestjs/common';
import { ContentService } from '../content/content.service';

@Injectable()
export class SchedulingService {
  constructor(private readonly contentService: ContentService) {}

  async schedulePost(
    cardId: string,
    scheduleData: {
      scheduledDate: string;
      scheduledTime: string;
      platform: string;
      notes?: string;
    }
  ): Promise<void> {
    await this.contentService.updateContentCard(cardId, {
      scheduled_date: new Date(scheduleData.scheduledDate),
      scheduled_time: scheduleData.scheduledTime,
      platform: scheduleData.platform,
      notes: scheduleData.notes,
      status: 'Scheduled',
    });
  }

  async submitForReview(cardId: string): Promise<void> {
    await this.contentService.updateContentCard(cardId, {
      status: 'UnderReview',
    });
  }

  async addToLibrary(cardId: string): Promise<void> {
    await this.contentService.addToLibrary(cardId);
  }
}