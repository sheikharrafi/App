-- =============================================
-- 🚀 CURIOUS MIND - Full Admin Panel Database Schema
-- Supabase SQL Editor-এ এই পুরো কোড run করুন
-- =============================================

-- =============================================
-- 1. SITE SETTINGS (সাইটের সেটিংস)
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'Curious Mind',
  tagline TEXT DEFAULT 'Exploring the Universe of Knowledge',
  meta_description TEXT DEFAULT 'A blog about Science, Technology, Mathematics and Discovery',
  logo_url TEXT,
  favicon_url TEXT,
  maintenance_mode BOOLEAN DEFAULT false,
  maintenance_message TEXT DEFAULT 'Site is under maintenance. Please check back later.',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 2. THEME SETTINGS (থিম/রঙ সেটিংস)
-- =============================================
CREATE TABLE IF NOT EXISTS theme_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  primary_color TEXT DEFAULT '#8B5CF6',
  secondary_color TEXT DEFAULT '#3B82F6',
  background_color TEXT DEFAULT '#0F0F2E',
  surface_color TEXT DEFAULT '#1a1a3e',
  text_color TEXT DEFAULT '#F8FAFC',
  text_muted_color TEXT DEFAULT '#94A3B8',
  accent_color TEXT DEFAULT '#A78BFA',
  font_family TEXT DEFAULT 'Inter',
  font_size_base TEXT DEFAULT '16px',
  font_weight_heading TEXT DEFAULT '700',
  border_radius TEXT DEFAULT '12px',
  dark_mode_default BOOLEAN DEFAULT true,
  custom_css TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 3. CATEGORIES (ক্যাটেগরি)
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT '📁',
  color TEXT DEFAULT '#8B5CF6',
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  article_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 4. ARTICLES (আর্টিকেল)
-- =============================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  read_time TEXT DEFAULT '5 min read',
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  author TEXT DEFAULT 'Admin',
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 5. PAGES (পেজ কনটেন্ট - Home, About, Contact)
-- =============================================
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 6. NAVIGATION (নেভিগেশন মেনু)
-- =============================================
CREATE TABLE IF NOT EXISTS navigation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  is_external BOOLEAN DEFAULT false,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 7. FOOTER (ফুটার)
-- =============================================
CREATE TABLE IF NOT EXISTS footer_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  copyright_text TEXT DEFAULT '© 2026 Curious Mind. All rights reserved.',
  description TEXT DEFAULT 'Exploring the Universe of Knowledge',
  show_social_links BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 8. SOCIAL LINKS (সোশ্যাল মিডিয়া লিংক)
-- =============================================
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 9. SECTIONS (হোমপেজ সেকশন কন্ট্রোল)
-- =============================================
CREATE TABLE IF NOT EXISTS sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 10. MEDIA (মিডিয়া/ইমেজ রেকর্ড)
-- =============================================
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  alt_text TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 11. NEWSLETTER SUBSCRIBERS
-- =============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- =============================================
-- 12. ADMIN USERS (কারা admin access পাবে)
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 🔧 FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_theme_settings_updated_at BEFORE UPDATE ON theme_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_navigation_updated_at BEFORE UPDATE ON navigation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_settings_updated_at BEFORE UPDATE ON footer_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 🔒 ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access (website visitors can read)
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read theme_settings" ON theme_settings FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public read pages" ON pages FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read navigation" ON navigation FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read footer_settings" ON footer_settings FOR SELECT USING (true);
CREATE POLICY "Public read social_links" ON social_links FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read sections" ON sections FOR SELECT USING (is_visible = true);

-- Admin full access (authenticated admin users)
CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access theme_settings" ON theme_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access articles" ON articles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access pages" ON pages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access navigation" ON navigation FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access footer_settings" ON footer_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access social_links" ON social_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access sections" ON sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access media" ON media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access newsletter" ON newsletter_subscribers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access admin_users" ON admin_users FOR ALL USING (auth.role() = 'authenticated');

-- Public can subscribe to newsletter
CREATE POLICY "Public insert newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Public can read media (for displaying images)
CREATE POLICY "Public read media" ON media FOR SELECT USING (true);

-- =============================================
-- 📦 DEFAULT DATA (Initial seed)
-- =============================================

-- Default site settings
INSERT INTO site_settings (site_name, tagline, meta_description)
VALUES ('Curious Mind', 'Exploring the Universe of Knowledge', 'A blog about Science, Technology, Mathematics and Discovery');

-- Default theme
INSERT INTO theme_settings (primary_color, secondary_color, background_color, surface_color, text_color, text_muted_color, font_family)
VALUES ('#8B5CF6', '#3B82F6', '#0F0F2E', '#1a1a3e', '#F8FAFC', '#94A3B8', 'Inter');

-- Default footer
INSERT INTO footer_settings (copyright_text, description)
VALUES ('© 2026 Curious Mind. All rights reserved.', 'Exploring the Universe of Knowledge');

-- Default categories
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
('Science', 'science', 'Exploring the wonders of the natural world', '🔬', '#8B5CF6', 1),
('Technology', 'technology', 'Latest in tech and innovation', '💻', '#3B82F6', 2),
('Mathematics', 'mathematics', 'The language of the universe', '📐', '#EC4899', 3),
('Discovery', 'discovery', 'New findings and explorations', '🔭', '#10B981', 4);

-- Default navigation
INSERT INTO navigation (label, href, sort_order) VALUES
('Home', '/', 1),
('Articles', '/articles', 2),
('Categories', '/categories', 3),
('About', '/about', 4),
('Contact', '/contact', 5);

-- Default social links
INSERT INTO social_links (platform, url, icon, sort_order) VALUES
('Twitter', 'https://twitter.com', 'FaTwitter', 1),
('GitHub', 'https://github.com', 'FaGithub', 2),
('LinkedIn', 'https://linkedin.com', 'FaLinkedin', 3);

-- Default homepage sections
INSERT INTO sections (section_key, title, sort_order, is_visible, config) VALUES
('hero', 'Hero Section', 1, true, '{"heading": "Welcome to Curious Mind", "subheading": "Exploring the Universe of Knowledge — Science, Technology, Mathematics & Discovery", "cta_text": "Start Reading", "cta_link": "/articles", "show_astronaut": true}'),
('featured_articles', 'Featured Articles', 2, true, '{"count": 3, "heading": "Latest Articles"}'),
('category_browser', 'Category Browser', 3, true, '{"heading": "Browse by Category"}'),
('newsletter', 'Newsletter', 4, true, '{"heading": "Stay Curious", "subheading": "Get the latest articles delivered to your inbox", "button_text": "Subscribe"}');

-- Default pages content
INSERT INTO pages (page_key, title, content, meta_title, meta_description) VALUES
('home', 'Home', '{"hero_heading": "Welcome to Curious Mind", "hero_subheading": "Exploring the Universe of Knowledge"}', 'Curious Mind - Home', 'A blog about Science, Technology, Mathematics and Discovery'),
('about', 'About', '{"heading": "About Curious Mind", "content": "We are passionate about exploring the universe of knowledge. From quantum physics to artificial intelligence, from pure mathematics to the discovery of new worlds — we cover it all.", "image_url": "", "mission": "Our mission is to make complex topics accessible and engaging for everyone."}', 'About - Curious Mind', 'Learn more about Curious Mind'),
('contact', 'Contact', '{"heading": "Get in Touch", "description": "Have a question or suggestion? We would love to hear from you.", "email": "hello@curiousmind.com", "location": "Planet Earth"}', 'Contact - Curious Mind', 'Contact Curious Mind');

-- Default 404 page
INSERT INTO pages (page_key, title, content) VALUES
('404', 'Page Not Found', '{"heading": "404 - Lost in Space", "description": "The page you are looking for does not exist or has been moved.", "cta_text": "Go Home", "cta_link": "/"}');

-- =============================================
-- 📦 INDEXES (Performance)
-- =============================================
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_navigation_sort ON navigation(sort_order);
CREATE INDEX idx_sections_sort ON sections(sort_order);

-- =============================================
-- 🗄️ STORAGE BUCKET (Supabase Storage for images)
-- Run this in Supabase SQL Editor separately if needed:
-- =============================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
-- CREATE POLICY "Public read media bucket" ON storage.objects FOR SELECT USING (bucket_id = 'media');
-- CREATE POLICY "Admin upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admin delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
