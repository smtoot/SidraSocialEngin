export interface ContentCategory {
  id: string;
  name: string;
  description: string;
  primary_goal: 'trust' | 'objections' | 'education' | 'conversion' | 'branding' | 'seasonal';
  primary_audience: 'parent' | 'student' | 'teacher' | 'general';
  default_tone: string[];
  default_content_types: string[];
  angles: string[];
  guardrails: string[];
  priority: 'high' | 'medium' | 'low';
  is_active: boolean;
  created_at: string;
}

export interface ContentIdea {
  id: string;
  category_id: string;
  category?: ContentCategory;
  content_type: 'text' | 'image_text' | 'carousel' | 'video';
  angle: string;
  idea_text: string;
  status: 'draft' | 'approved' | 'archived';
  created_by?: string;
  created_at: string;
}

export interface CategorySummary {
  category: ContentCategory;
  ideasCount: number;
  approvedCount: number;
  publishedCount: number;
}