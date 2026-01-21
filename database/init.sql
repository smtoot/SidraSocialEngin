-- Create database
CREATE DATABASE sidra_factory;

-- Connect to the database
\c sidra_factory;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create content_cards table
CREATE TABLE content_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic VARCHAR(255) NOT NULL,
    selected_idea_id UUID,
    copy_text TEXT,
    tone VARCHAR(50),
    culture_context VARCHAR(50),
    platform VARCHAR(50) DEFAULT 'facebook',
    status VARCHAR(50) DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    scheduled_date DATE,
    audit_trail JSONB
);

-- Create idea_options table
CREATE TABLE idea_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES content_cards(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    rationale TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_content_cards_status ON content_cards(status);
CREATE INDEX idx_content_cards_platform ON content_cards(platform);
CREATE INDEX idx_content_cards_created_at ON content_cards(created_at);
CREATE INDEX idx_idea_options_topic_id ON idea_options(topic_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for content_cards
CREATE TRIGGER update_content_cards_updated_at 
    BEFORE UPDATE ON content_cards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO content_cards (topic, platform, status) VALUES 
('بداية العام الدراسي', 'facebook', 'Draft'),
('العيد الأضحى', 'facebook', 'Draft'),
('تخفيضات الصيف', 'facebook', 'Draft');

-- Insert sample ideas for the first content card
INSERT INTO idea_options (topic_id, text, rationale) VALUES 
((SELECT id FROM content_cards WHERE topic = 'بداية العام الدراسي' LIMIT 1), 
 'نصائح عملية للطلاب في بداية العام الدراسي', 
 'محتوى تعليمي مفيد يساعد الطلاب على الاستعداد للعام الجديد'),
((SELECT id FROM content_cards WHERE topic = 'بداية العام الدراسي' LIMIT 1), 
 'رسالة موجهة لأولياء الأمور حول أهمية المشاركة', 
 'بناء جسر تواصل مع العائلة لضمان نجاح الطلاب'),
((SELECT id FROM content_cards WHERE topic = 'بداية العام الدراسي' LIMIT 1), 
 'عرض خاص على المستلزمات الدراسية للعام الجديد', 
 'محفز تجاري يشجع على الشراء والمشاركة'),
((SELECT id FROM content_cards WHERE topic = 'بداية العام الدراسي' LIMIT 1), 
 'قصة نجاح طالب متفوق في العام الماضي', 
 'إلهام الطلاب وتحفيزهم لتحقيق النجاح'),
((SELECT id FROM content_cards WHERE topic = 'بداية العام الدراسي' LIMIT 1), 
 'دليل للأنشطة اللامنهجية والرياضية', 
 'توسيع آفاق الطلاب بما وراء المنهج الدراسي');

-- Grant permissions (adjust username as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sidra_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sidra_user;