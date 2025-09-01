-- Create spectacles table
CREATE TABLE IF NOT EXISTS spectacles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  age_range VARCHAR(50),
  duration INTEGER, -- in minutes
  language VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- Media
  main_image_url TEXT,
  gallery_images JSONB DEFAULT '[]',
  video_url TEXT,
  video_embed_code TEXT,
  
  -- Content
  synopsis TEXT,
  pedagogical_content TEXT,
  technical_requirements TEXT,
  
  -- Pricing
  price_individual DECIMAL(10,2),
  price_group DECIMAL(10,2),
  price_school DECIMAL(10,2),
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Admin info
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create spectacle sessions table
CREATE TABLE IF NOT EXISTS spectacle_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spectacle_id UUID REFERENCES spectacles(id) ON DELETE CASCADE,
  
  -- Session details
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  venue VARCHAR(255),
  venue_address TEXT,
  capacity INTEGER DEFAULT 100,
  available_seats INTEGER,
  
  -- Pricing for this session
  price_override DECIMAL(10,2),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'sold_out', 'postponed')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spectacle categories table
CREATE TABLE IF NOT EXISTS spectacle_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7), -- hex color
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for spectacle-category relationships
CREATE TABLE IF NOT EXISTS spectacle_category_relations (
  spectacle_id UUID REFERENCES spectacles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES spectacle_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (spectacle_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_spectacles_status ON spectacles(status);
CREATE INDEX IF NOT EXISTS idx_spectacles_slug ON spectacles(slug);
CREATE INDEX IF NOT EXISTS idx_spectacles_created_at ON spectacles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_spectacle_sessions_date ON spectacle_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_spectacle_sessions_spectacle_id ON spectacle_sessions(spectacle_id);

-- Enable RLS
ALTER TABLE spectacles ENABLE ROW LEVEL SECURITY;
ALTER TABLE spectacle_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE spectacle_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE spectacle_category_relations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for spectacles
CREATE POLICY "Public can view published spectacles" ON spectacles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all spectacles" ON spectacles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.admin_role IN ('admin_full', 'super_admin', 'admin_spectacles')
    )
  );

-- RLS Policies for sessions
CREATE POLICY "Public can view active sessions" ON spectacle_sessions
  FOR SELECT USING (
    status = 'active' AND 
    EXISTS (SELECT 1 FROM spectacles WHERE spectacles.id = spectacle_sessions.spectacle_id AND spectacles.status = 'published')
  );

CREATE POLICY "Admins can manage all sessions" ON spectacle_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.admin_role IN ('admin_full', 'super_admin', 'admin_spectacles')
    )
  );

-- RLS Policies for categories
CREATE POLICY "Public can view categories" ON spectacle_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON spectacle_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.admin_role IN ('admin_full', 'super_admin', 'admin_spectacles')
    )
  );

-- RLS Policies for category relations
CREATE POLICY "Public can view category relations" ON spectacle_category_relations
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage category relations" ON spectacle_category_relations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.admin_role IN ('admin_full', 'super_admin', 'admin_spectacles')
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_spectacles_updated_at 
  BEFORE UPDATE ON spectacles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spectacle_sessions_updated_at 
  BEFORE UPDATE ON spectacle_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO spectacle_categories (name, slug, description, color, icon, sort_order) VALUES
('Théâtre Jeunesse', 'theatre-jeunesse', 'Spectacles de théâtre adaptés aux enfants et adolescents', '#FF6B6B', 'theater', 1),
('Conte Musical', 'conte-musical', 'Spectacles alliant narration et musique', '#4ECDC4', 'music', 2),
('Comédie', 'comedie', 'Spectacles humoristiques et divertissants', '#45B7D1', 'laugh', 3),
('Drame', 'drame', 'Pièces dramatiques et émotionnelles', '#96CEB4', 'drama', 4),
('Spectacle Interactif', 'spectacle-interactif', 'Spectacles avec participation du public', '#FECA57', 'users', 5)
ON CONFLICT (slug) DO NOTHING;
