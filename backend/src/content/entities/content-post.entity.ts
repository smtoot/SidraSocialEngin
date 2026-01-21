import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContentIdea } from './content-idea.entity';
import { ContentCategory } from './content-category.entity';

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