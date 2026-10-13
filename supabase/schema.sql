-- ==============================================================================
-- RAJESHWAR STEEL INDUSTRIES - COMPLETE SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- This schema provisions all required database tables, relationships, foreign keys,
-- row-level security (RLS) policies, storage buckets, and initial seed data.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  grade TEXT DEFAULT 'SS 304', -- e.g. 'SS 304', 'SS 202', 'Both SS 304 & SS 202', 'Custom'
  finish TEXT DEFAULT 'Mirror Finish', -- e.g. 'Mirror Finish', 'Matte Finish', 'Golden PVD', 'Black Powder Coated', 'Brown'
  material TEXT DEFAULT 'Stainless Steel',
  dimensions TEXT,
  customization_details TEXT,
  location TEXT,
  contact_info TEXT,
  featured BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT DEFAULT 'Bhopal, MP',
  client_name TEXT,
  completion_date TEXT,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROJECT IMAGES TABLE
CREATE TABLE IF NOT EXISTS project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BUSINESS SETTINGS TABLE (Single-row configuration)
CREATE TABLE IF NOT EXISTS business_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  business_name TEXT NOT NULL DEFAULT 'Rajeshwar Steel Industries',
  address TEXT NOT NULL DEFAULT 'C-4, Shop No. 1, Soubhagya Nagar, I-Sector, Industrial Area, Govindpura Semra Road, Bhopal - 462023, Madhya Pradesh, India.',
  logo_url TEXT DEFAULT '/logo.svg',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  email TEXT DEFAULT '',
  opening_hours TEXT DEFAULT '',
  google_maps_link TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  facebook_url TEXT DEFAULT '',
  homepage_headline TEXT NOT NULL DEFAULT 'Premium Stainless Steel Railings & Custom Fabrication',
  homepage_description TEXT NOT NULL DEFAULT 'Specializing in architectural SS 304 & SS 202 railings, precision laser-cut decorative panels, glass balustrades, and custom industrial metal fabrication in Bhopal.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CUSTOMER ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  product_service TEXT NOT NULL,
  description TEXT NOT NULL,
  preferred_design TEXT,
  dimensions TEXT,
  status VARCHAR(50) DEFAULT 'New', -- 'New', 'Contacted', 'Quotation Sent', 'Completed', 'Cancelled'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ROW-LEVEL SECURITY (RLS) POLICIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Public can read published data
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Public product images are viewable by everyone" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Public project images are viewable by everyone" ON project_images FOR SELECT USING (true);
CREATE POLICY "Public settings are viewable by everyone" ON business_settings FOR SELECT USING (true);

-- Public can submit customer enquiries
CREATE POLICY "Public can submit enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- Authenticated admins have full CRUD access
CREATE POLICY "Admins have full access to categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to product_images" ON product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to project_images" ON project_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to business_settings" ON business_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to enquiries" ON enquiries FOR ALL USING (auth.role() = 'authenticated');

-- 10. INITIAL SEED DATA
INSERT INTO business_settings (id, business_name, address, logo_url, phone, whatsapp, email, opening_hours, google_maps_link, homepage_headline, homepage_description)
VALUES (
  'default',
  'Rajeshwar Steel Industries',
  'C-4, Shop No. 1, Soubhagya Nagar, I-Sector, Industrial Area, Govindpura Semra Road, Bhopal - 462023, Madhya Pradesh, India.',
  '/logo.svg',
  '',
  '',
  '',
  '',
  '',
  'Premium Stainless Steel Railings & Custom Fabrication',
  'Specializing in architectural SS 304 & SS 202 railings, precision laser-cut decorative panels, glass balustrades, and custom industrial metal fabrication in Bhopal.'
) ON CONFLICT (id) DO NOTHING;

-- Initial Mandatory Product Categories
INSERT INTO categories (id, name, slug, description, display_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Laser Cutting Designs', 'laser-cutting-designs', 'Decorative stainless steel laser-cut panels, custom railing designs, architectural screens and bespoke patterns in SS 202 and SS 304.', 1),
  ('c1000000-0000-0000-0000-000000000002', 'Glass Railings', 'glass-railings', 'Modern toughened glass railing systems with SS spigots, square/round top caps, available in mirror, matte black, golden PVD, and bronze finishes.', 2),
  ('c1000000-0000-0000-0000-000000000003', 'Square Stainless Steel Railings', 'square-stainless-steel-railings', 'Contemporary square-pipe architectural railings for balconies, staircases, and open terraces in certified SS 304 and SS 202.', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Round Stainless Steel Railings', 'round-stainless-steel-railings', 'Classic ergonomic round-pipe stainless steel handrails, balusters, and continuous railing systems for residential and commercial spaces.', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Roof Windows and Other Products', 'roof-windows-and-other-products', 'Specialized roof windows, skylight metal framing, custom architectural fabrication, and industrial metalwork.', 5)
ON CONFLICT (slug) DO NOTHING;
