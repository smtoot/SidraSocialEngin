import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('Content')
@Controller('content')
@ApiBearerAuth()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get content card by ID' })
  @ApiResponse({ status: 200, description: 'Content card retrieved successfully' })
  async getContentCard(@Param('id') id: string) {
    const contentCard = await this.contentService.getContentCard(id);
    return {
      success: true,
      data: contentCard,
    };
  }

  @Get('library')
  @ApiOperation({ summary: 'Get content library' })
  @ApiResponse({ status: 200, description: 'Content library retrieved successfully' })
  async getLibrary() {
    const library = await this.contentService.getContentLibrary();
    return {
      success: true,
      data: library,
    };
  }

  @Get('moderation-queue')
  @ApiOperation({ summary: 'Get content moderation queue' })
  @ApiResponse({ status: 200, description: 'Moderation queue retrieved successfully' })
  async getModerationQueue() {
    const queue = await this.contentService.getModerationQueue();
    return {
      success: true,
      data: queue.map(item => ({
        ...item,
        audit_trail: item.audit_trail || [],
      })),
    };
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve content' })
  @ApiResponse({ status: 200, description: 'Content approved successfully' })
  async approveContent(@Param('id') id: string) {
    await this.contentService.approveContent(id);
    return {
      success: true,
      data: { message: 'Content approved' },
    };
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject content' })
  @ApiResponse({ status: 200, description: 'Content rejected successfully' })
  async rejectContent(@Param('id') id: string, @Body() body: { reason: string }) {
    await this.contentService.rejectContent(id, body.reason);
    return {
      success: true,
      data: { message: 'Content rejected' },
    };
  }
}
