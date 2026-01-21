import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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