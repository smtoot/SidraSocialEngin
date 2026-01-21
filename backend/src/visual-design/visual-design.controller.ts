import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { VisualDesignService } from './visual-design.service';

@ApiTags('Visual Design')
@Controller('visual-design')
@ApiBearerAuth()
export class VisualDesignController {
  constructor(private readonly visualDesignService: VisualDesignService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate image using AI' })
  @ApiResponse({ status: 201, description: 'Image generated successfully' })
  async generateImage(@Body() generateDto: { prompt: string; style: string }) {
    const image = await this.visualDesignService.generateImage(
      generateDto.prompt,
      generateDto.style,
    );
    
    return {
      success: true,
      data: image,
    };
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload an image from device' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  async uploadImage(
    @Body() uploadDto: { cardId: string; imageUrl: string; fileName: string },
  ) {
    const image = await this.visualDesignService.uploadImage(
      uploadDto.cardId,
      uploadDto.imageUrl,
      uploadDto.fileName,
    );
    
    return {
      success: true,
      data: image,
    };
  }

  @Post('select')
  @ApiOperation({ summary: 'Select and save an image for the content card' })
  @ApiResponse({ status: 200, description: 'Image selected successfully' })
  async selectImage(
    @Body() selectDto: { 
      cardId: string; 
      imageData: { id: string; url: string; prompt: string; source: string } 
    }
  ) {
    await this.visualDesignService.saveSelectedImage(
      selectDto.cardId,
      selectDto.imageData,
    );
    
    return {
      success: true,
      data: { nextStep: 'review' },
    };
  }
}