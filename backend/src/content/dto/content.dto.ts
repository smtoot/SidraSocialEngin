import { IsString, IsNotEmpty, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContentCardDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  @IsNotEmpty()
  platform: string;
}

export class GenerateIdeasDto {
  @IsString()
  @IsNotEmpty()
  topic: string;
}

export class SelectIdeaDto {
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsString()
  @IsNotEmpty()
  ideaId: string;
}

export class ManualIdeaData {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  rationale: string;

  @IsString()
  @IsOptional()
  authorId?: string;

  @IsString()
  @IsOptional()
  authorName?: string;

  @IsOptional()
  isManual?: boolean;
}

export class CreateManualIdeaDto {
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @ValidateNested()
  @Type(() => ManualIdeaData)
  idea: ManualIdeaData;
}

export class ComposeCopyDto {
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsString()
  @IsNotEmpty()
  ideaTextSeed: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['friendly', 'professional', 'creative', 'formal'])
  tone: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['sudanese', 'british', 'hybrid'])
  cultureContext: string;
}

export class ApproveCopyDto {
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsString()
  @IsOptional()
  edits?: string;
}

export class CreateManualCopyDto {
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsString()
  @IsNotEmpty()
  copyText: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  authorName: string;
}