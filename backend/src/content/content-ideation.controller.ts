import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ContentCategoriesService } from './content-categories.service';
import { ContentIdeasService } from './content-ideas.service';
import { ContentCategory } from './entities/content-category.entity';
import { ContentIdea } from './entities/content-idea.entity';

@ApiTags('Content Categories')
@Controller('content/categories')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class ContentCategoriesController {
  constructor(
    private readonly categoriesService: ContentCategoriesService,
    private readonly ideasService: ContentIdeasService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all active categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getCategories() {
    const categories = await this.categoriesService.findAll();
    return {
      success: true,
      data: categories,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  async getCategory(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(id);
    return {
      success: true,
      data: category,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async createCategory(@Body() categoryData: Partial<ContentCategory>) {
    const category = await this.categoriesService.create(categoryData);
    return {
      success: true,
      data: category,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  async updateCategory(@Param('id') id: string, @Body() categoryData: Partial<ContentCategory>) {
    const category = await this.categoriesService.update(id, categoryData);
    return {
      success: true,
      data: category,
    };
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get categories with counters' })
  @ApiResponse({ status: 200, description: 'Categories summary retrieved successfully' })
  async getCategoriesSummary() {
    const summary = await this.categoriesService.getSummary();
    return {
      success: true,
      data: summary,
    };
  }
}

@ApiTags('Content Ideas')
@Controller('content/ideas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class ContentIdeasController {
  constructor(
    private readonly ideasService: ContentIdeasService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create manual idea' })
  @ApiResponse({ status: 201, description: 'Manual idea created successfully' })
  async createIdea(@Body() body: { categoryId: string; angle: string; contentType: string; ideaText: string }) {
    const idea = await this.ideasService.createManualIdea(body.categoryId, body.angle, body.contentType, body.ideaText);
    return {
      success: true,
      data: idea,
    };
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate AI ideas for category' })
  @ApiResponse({ status: 200, description: 'Ideas generated successfully' })
  async generateIdeas(@Body() body: { categoryId: string; angle: string; contentType: string }) {
    const ideas = await this.ideasService.generateIdeas(body.categoryId, body.angle, body.contentType);
    return {
      success: true,
      data: ideas,
    };
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve idea' })
  @ApiResponse({ status: 200, description: 'Idea approved successfully' })
  async approveIdea(@Param('id') id: string) {
    await this.ideasService.approveIdea(id);
    return {
      success: true,
      data: { message: 'Idea approved' },
    };
  }
}