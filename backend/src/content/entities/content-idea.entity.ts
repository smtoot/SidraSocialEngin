import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContentCategory } from './content-category.entity';

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
  content_type: 'text' | 'image_text' | 'carousel' | 'video';

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