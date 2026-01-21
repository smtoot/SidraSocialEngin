import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IdeationService } from './ideation.service';
import { GenerateIdeasDto, SelectIdeaDto, CreateManualIdeaDto } from '../content/dto/content.dto';

@ApiTags('Ideation')
@Controller('ideation')
@ApiBearerAuth()
export class IdeationController {
  constructor(private readonly ideationService: IdeationService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate 5 content ideas based on topic' })
  @ApiResponse({ status: 200, description: 'Ideas generated successfully' })
  async generateIdeas(@Body() generateDto: GenerateIdeasDto) {
    return {
      success: true,
      data: await this.ideationService.generateIdeas(generateDto.topic),
    };
  }

  @Post('manual')
  @ApiOperation({ summary: 'Create a manual idea without AI' })
  @ApiResponse({ status: 201, description: 'Manual idea created successfully' })
  async createManualIdea(@Body() manualDto: CreateManualIdeaDto) {
    return {
      success: true,
      data: await this.ideationService.createManualIdea(manualDto.cardId, manualDto.idea),
    };
  }

  @Post('select')
  @ApiOperation({ summary: 'Select an idea from generated options' })
  @ApiResponse({ status: 200, description: 'Idea selected successfully' })
  async selectIdea(@Body() selectDto: SelectIdeaDto) {
    await this.ideationService.selectIdea(selectDto.cardId, selectDto.ideaId);
    return {
      success: true,
      data: { nextStep: 'copywriting' },
    };
  }
}