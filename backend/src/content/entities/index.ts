import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContentCard } from './content-card.entity';

// Backward compatibility with existing content workflow
@Entity('idea_options')
export class IdeaOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  topic_id: string;

  @Column()
  text: string;

  @Column()
  rationale: string;

  @Column({ nullable: true })
  author_id: string;

  @Column({ nullable: true })
  author_name: string;

  @Column({ default: false })
  is_manual: boolean;

  @ManyToOne(() => ContentCard, card => card.ideas)
  @JoinColumn({ name: 'topic_id' })
  topic: ContentCard;
}

// New entities for structured content workflow
@Entity('content_categories')
export class ContentCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ enum: ['trust', 'objections', 'education', 'conversion', 'branding', 'seasonal'] })
  primary_goal: string;

  @Column({ enum: ['parent', 'student', 'teacher', 'general'] })
  primary_audience: string;

  @Column({ type: 'simple-json' })
  default_tone: string[];

  @Column({ type: 'simple-json' })
  default_content_types: string[];

  @Column({ type: 'simple-json' })
  angles: string[];

  @Column({ type: 'simple-json' })
  guardrails: string[];

  @Column({ enum: ['high', 'medium', 'low'] })
  priority: 'high' | 'medium' | 'low';

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}

@Entity('content_ideas')
export class ContentIdea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category_id: string;

  @ManyToOne(() => ContentCategory)
  @JoinColumn({ name: 'category_id' })
  category: ContentCategory;

  @Column({ enum: ['text', 'image_text', 'carousel', 'video'] })
  content_type: string;

  @Column()
  angle: string;

  @Column({ type: 'text' })
  idea_text: string;

  @Column({ enum: ['draft', 'approved', 'archived'], default: 'draft' })
  status: 'draft' | 'approved' | 'archived';

  @Column({ nullable: true })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;
}

@Entity('content_posts')
export class ContentPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  idea_id: string;

  @ManyToOne(() => ContentIdea)
  @JoinColumn({ name: 'idea_id' })
  idea: ContentIdea;

  @Column()
  category_id: string;

  @ManyToOne(() => ContentCategory)
  @JoinColumn({ name: 'category_id' })
  category: ContentCategory;

  @Column({ enum: ['draft', 'approved', 'scheduled', 'published'], default: 'draft' })
  status: 'draft' | 'approved' | 'scheduled' | 'published';

  @Column({ nullable: true })
  scheduled_at: Date;

  @Column({ nullable: true })
  published_at: Date;
}