import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SchedulingService } from './scheduling.service';

@ApiTags('Scheduling')
@Controller('scheduling')
@ApiBearerAuth()
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post('schedule')
  @ApiOperation({ summary: 'Schedule a post for publication' })
  @ApiResponse({ status: 200, description: 'Post scheduled successfully' })
  async schedulePost(
    @Body() scheduleDto: {
      cardId: string;
      scheduledDate: string;
      scheduledTime: string;
      platform: string;
      notes?: string;
    }
  ) {
    await this.schedulingService.schedulePost(scheduleDto.cardId, {
      scheduledDate: scheduleDto.scheduledDate,
      scheduledTime: scheduleDto.scheduledTime,
      platform: scheduleDto.platform,
      notes: scheduleDto.notes,
    });
    
    return {
      success: true,
      data: { message: 'Post scheduled successfully' },
    };
  }

  @Post('submit-review')
  @ApiOperation({ summary: 'Submit post for review' })
  @ApiResponse({ status: 200, description: 'Post submitted for review successfully' })
  async submitForReview(@Body() submitDto: { cardId: string }) {
    await this.schedulingService.submitForReview(submitDto.cardId);
    
    return {
      success: true,
      data: { message: 'Post submitted for review' },
    };
  }

  @Post('add-library')
  @ApiOperation({ summary: 'Add post to content library' })
  @ApiResponse({ status: 200, description: 'Post added to library successfully' })
  async addToLibrary(@Body() addDto: { cardId: string }) {
    await this.schedulingService.addToLibrary(addDto.cardId);
    
    return {
      success: true,
      data: { message: 'Post added to content library' },
    };
  }
}