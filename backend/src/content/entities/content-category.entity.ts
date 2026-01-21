import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ContentIdea } from './content-idea.entity';

@Entity('content_categories')
export class ContentCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ enum: ['trust', 'objections', 'education', 'conversion', 'branding', 'seasonal'] })
  primary_goal: 'trust' | 'objections' | 'education' | 'conversion' | 'branding' | 'seasonal';

  @Column({ enum: ['parent', 'student', 'teacher', 'general'] })
  primary_audience: 'parent' | 'student' | 'teacher' | 'general';

  @Column({ type: 'simple-json' })
  default_tone: string[];

  @Column({ type: 'simple-json' })
  default_content_types: string[];

  @Column({ type: 'simple-json' })
  angles: string[];

  @Column({ type: 'simple-json' })
  guardrails: string[];

  @Column({ enum: ['high', 'medium', 'low'], default: 'medium' })
  priority: 'high' | 'medium' | 'low';

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}