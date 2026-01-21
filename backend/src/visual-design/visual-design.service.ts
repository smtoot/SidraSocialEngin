import { Injectable } from '@nestjs/common';
import { ContentService } from '../content/content.service';

@Injectable()
export class VisualDesignService {
  constructor(private readonly contentService: ContentService) {}

  async generateImage(prompt: string, style: string): Promise<{ url: string; prompt: string }> {
    const mockImages = [
      `https://picsum.photos/seed/${Date.now()}/800/600`,
      `https://picsum.photos/seed/${Date.now() + 1}/800/600`,
      `https://picsum.photos/seed/${Date.now() + 2}/800/600`,
    ];

    return {
      url: mockImages[Math.floor(Math.random() * mockImages.length)],
      prompt,
    };
  }

  async uploadImage(cardId: string, imageUrl: string, fileName: string): Promise<{ id: string; url: string; source: string }> {
    return {
      id: `upload-${Date.now()}`,
      url: imageUrl,
      source: 'upload',
    };
  }

  async saveSelectedImage(
    cardId: string,
    imageData: { id: string; url: string; prompt: string; source: string }
  ): Promise<void> {
    await this.contentService.updateContentCard(cardId, {
      selected_image_id: imageData.id,
      selected_image_url: imageData.url,
      selected_image_prompt: imageData.prompt,
      selected_image_source: imageData.source,
      status: 'ReadyForReview',
    });
  }
}