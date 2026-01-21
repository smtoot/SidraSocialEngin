import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CopywritingService } from './copywriting.service';
import { ComposeCopyDto, ApproveCopyDto, CreateManualCopyDto } from '../content/dto/content.dto';

@ApiTags('Copywriting')
@Controller('copywriting')
@ApiBearerAuth()
export class CopywritingController {
  constructor(private readonly copywritingService: CopywritingService) {}

  @Post('compose')
  @ApiOperation({ summary: 'Compose copy based on selected idea, tone, and culture' })
  @ApiResponse({ status: 200, description: 'Copy composed successfully' })
  async composeCopy(@Body() composeDto: ComposeCopyDto) {
    return {
      success: true,
      data: await this.copywritingService.composeCopy(composeDto),
    };
  }

  @Post('manual')
  @ApiOperation({ summary: 'Create manual copy without AI' })
  @ApiResponse({ status: 201, description: 'Manual copy created successfully' })
  async createManualCopy(@Body() manualDto: CreateManualCopyDto) {
    await this.copywritingService.createManualCopy(
      manualDto.cardId,
      manualDto.copyText,
      manualDto.authorId,
      manualDto.authorName,
    );
    return {
      success: true,
      data: { message: 'Manual copy created successfully' },
    };
  }

  @Post('approve')
  @ApiOperation({ summary: 'Approve and save the final copy' })
  @ApiResponse({ status: 200, description: 'Copy approved successfully' })
  async approveCopy(@Body() approveDto: ApproveCopyDto) {
    await this.copywritingService.approveCopy(approveDto.cardId, approveDto.edits);
    return {
      success: true,
      data: { message: 'Copy approved and saved successfully' },
    };
  }
}