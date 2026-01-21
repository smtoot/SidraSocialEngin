import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IdeaOption } from './idea-option.entity';

@Entity('content_cards')
export class ContentCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  topic: string;

  @Column({ nullable: true })
  selected_idea_id: string;

  @Column({ nullable: true, type: 'text' })
  copy_text: string;

  @Column({ nullable: true })
  tone: string;

  @Column({ nullable: true })
  culture_context: string;

  @Column({ nullable: true })
  selected_image_id: string;

  @Column({ nullable: true })
  selected_image_url: string;

  @Column({ nullable: true })
  selected_image_prompt: string;

  @Column({ nullable: true })
  selected_image_source: string;

  @Column({ default: 'facebook' })
  platform: string;

  @Column({ default: 'Draft' })
  status: string;

  @Column({ nullable: true })
  moderation_status: string;

  @Column({ nullable: true, type: 'text' })
  moderation_reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  scheduled_date: Date;

  @Column({ nullable: true })
  scheduled_time: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ type: 'simple-json', nullable: true })
  audit_trail: Record<string, any>;

  @OneToMany(() => IdeaOption, idea => idea.topic)
  ideas: IdeaOption[];

  @Column({ nullable: true })
  author_id: string;

  @Column({ nullable: true })
  author_name: string;

  @Column({ default: false })
  is_manual_idea: boolean;

  @Column({ default: false })
  is_manual_copy: boolean;

  @Column({ nullable: true })
  image_upload_url: string;
}