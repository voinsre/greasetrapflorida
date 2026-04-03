-- ============================================
-- Grease Trap Florida — Full Database Schema
-- Generated from blueprint Section 5 + 6
-- Run this in Supabase SQL Editor to set up
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CORE TABLES
-- ============================================

-- COUNTIES (replaces states table for single-state directory)
CREATE TABLE counties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  business_count INTEGER DEFAULT 0,
  fog_ordinance_url TEXT,
  fog_frequency_requirement TEXT,
  fog_enforcement_agency TEXT,
  meta_title TEXT,
  meta_description TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CITIES
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  county_slug TEXT REFERENCES counties(slug),
  county_name TEXT,
  business_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BUSINESSES (core listing data)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  phone_unformatted TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  city TEXT NOT NULL,
  county TEXT,
  county_slug TEXT,
  state TEXT NOT NULL DEFAULT 'Florida',
  state_abbreviation TEXT NOT NULL DEFAULT 'FL',
  zip TEXT,
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  description TEXT,
  rating DECIMAL(3,1),
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  -- Grease trap specific fields
  dep_licensed BOOLEAN DEFAULT FALSE,
  dep_license_number TEXT,
  dep_license_status TEXT DEFAULT 'not_verified',
  emergency_24_7 BOOLEAN DEFAULT FALSE,
  manifest_provided BOOLEAN DEFAULT FALSE,
  serves_restaurants BOOLEAN DEFAULT TRUE,
  serves_hotels BOOLEAN DEFAULT FALSE,
  serves_hospitals BOOLEAN DEFAULT FALSE,
  serves_schools BOOLEAN DEFAULT FALSE,
  serves_food_trucks BOOLEAN DEFAULT FALSE,
  years_in_business INTEGER,
  pricing_signals TEXT,
  -- Metadata
  insured BOOLEAN DEFAULT TRUE,
  featured_until TIMESTAMPTZ,
  place_id TEXT UNIQUE,
  opening_hours JSONB,
  website_status TEXT,
  enrichment_confidence TEXT DEFAULT 'low',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICE TYPES
CREATE TABLE service_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT
);

-- ESTABLISHMENT TYPES (who uses the service)
CREATE TABLE establishment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT
);

-- ============================================
-- JUNCTION TABLES
-- ============================================

CREATE TABLE business_services (
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  service_id UUID REFERENCES service_types(id) ON DELETE CASCADE,
  PRIMARY KEY (business_id, service_id)
);

CREATE TABLE business_establishment_types (
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  establishment_type_id UUID REFERENCES establishment_types(id) ON DELETE CASCADE,
  PRIMARY KEY (business_id, establishment_type_id)
);

-- SERVICE AREAS (which counties/cities a business serves)
CREATE TABLE business_service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  county_slug TEXT,
  city_slug TEXT
);

-- ============================================
-- USER INTERACTION TABLES
-- ============================================

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  business_name TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  establishment_type TEXT,
  trap_size TEXT,
  urgency TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  business_name TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'blog',
  image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_businesses_county ON businesses(county_slug);
CREATE INDEX idx_businesses_city ON businesses(city, county_slug);
CREATE INDEX idx_businesses_featured ON businesses(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_dep ON businesses(dep_licensed) WHERE dep_licensed = TRUE;
CREATE INDEX idx_businesses_place_id ON businesses(place_id);
CREATE INDEX idx_cities_county ON cities(county_slug);
CREATE INDEX idx_content_pages_published ON content_pages(published_at) WHERE published_at IS NOT NULL;
CREATE INDEX idx_content_pages_category ON content_pages(category);
CREATE INDEX idx_business_service_areas_business ON business_service_areas(business_id);
CREATE INDEX idx_business_service_areas_county ON business_service_areas(county_slug);

-- ============================================
-- SEED DATA: Service Types (10)
-- ============================================

INSERT INTO service_types (name, slug, description, meta_title, meta_description) VALUES
  ('Grease Trap Cleaning', 'grease-trap-cleaning', 'Professional grease trap pumping and cleaning services for commercial kitchens.', 'Grease Trap Cleaning Services in Florida', 'Find licensed grease trap cleaning companies across Florida. Compare providers and get free quotes.'),
  ('Grease Interceptor Pumping', 'grease-interceptor-pumping', 'Underground grease interceptor pump-out and maintenance services.', 'Grease Interceptor Pumping in Florida', 'Find grease interceptor pumping services in Florida. Licensed haulers for underground interceptors.'),
  ('Grease Trap Installation', 'grease-trap-installation', 'New grease trap and interceptor installation for restaurants and commercial kitchens.', 'Grease Trap Installation in Florida', 'Find grease trap installation services in Florida for restaurants and food service facilities.'),
  ('Grease Trap Repair & Replacement', 'grease-trap-repair-replacement', 'Repair, replacement, and upgrade services for grease traps and interceptors.', 'Grease Trap Repair in Florida', 'Find grease trap repair and replacement services in Florida. Fix damaged or failing grease traps.'),
  ('Hydro Jetting', 'hydro-jetting', 'High-pressure water jetting to clear grease buildup in drain lines and pipes.', 'Hydro Jetting Services in Florida', 'Find hydro jetting services in Florida for grease-clogged drain lines and pipes.'),
  ('Used Cooking Oil Collection', 'used-cooking-oil-collection', 'Scheduled pickup and recycling of used cooking oil and yellow grease.', 'Used Cooking Oil Collection in Florida', 'Find used cooking oil collection and recycling services in Florida.'),
  ('Emergency Overflow Service', 'emergency-overflow-service', '24/7 emergency response for grease trap overflows, backups, and spills.', 'Emergency Grease Trap Service in Florida', 'Find 24/7 emergency grease trap overflow services in Florida. Immediate response available.'),
  ('FOG Compliance Consulting', 'fog-compliance-consulting', 'Expert consulting on FOG compliance, Chapter 62-705, and local ordinances.', 'FOG Compliance Consulting in Florida', 'Find FOG compliance consulting services in Florida. Expert help with Chapter 62-705 requirements.'),
  ('Grease Trap Inspection', 'grease-trap-inspection', 'Professional grease trap inspection services for compliance and maintenance.', 'Grease Trap Inspection in Florida', 'Find grease trap inspection services in Florida. Ensure compliance with DEP and local requirements.'),
  ('Drain Line Cleaning', 'drain-line-cleaning', 'Commercial drain line cleaning and maintenance for food service facilities.', 'Drain Line Cleaning Services in Florida', 'Find commercial drain line cleaning services in Florida for restaurants and kitchens.');

-- ============================================
-- SEED DATA: Establishment Types (10)
-- ============================================

INSERT INTO establishment_types (name, slug, description) VALUES
  ('Restaurants', 'restaurants', 'Full-service and quick-service restaurants of all sizes.'),
  ('Hotels & Resorts', 'hotels-resorts', 'Hotels, resorts, and hospitality facilities with commercial kitchens.'),
  ('School Cafeterias', 'school-cafeterias', 'Public and private school cafeterias and university dining halls.'),
  ('Hospital Kitchens', 'hospital-kitchens', 'Hospital and healthcare facility food service operations.'),
  ('Catering Companies', 'catering-companies', 'Commercial catering operations and commissary kitchens.'),
  ('Food Trucks', 'food-trucks', 'Mobile food vendors and food truck commissaries.'),
  ('Shopping Mall Food Courts', 'shopping-mall-food-courts', 'Mall food courts and shared commercial kitchen facilities.'),
  ('Corporate Cafeterias', 'corporate-cafeterias', 'Corporate campus dining facilities and employee cafeterias.'),
  ('Bakeries', 'bakeries', 'Commercial bakeries and pastry production facilities.'),
  ('Bars & Nightclubs', 'bars-nightclubs', 'Bars, nightclubs, and entertainment venues with food service.');

-- ============================================
-- SEED DATA: All 67 Florida Counties
-- ============================================

INSERT INTO counties (name, slug, fog_ordinance_url, fog_frequency_requirement, fog_enforcement_agency, meta_title, meta_description) VALUES
  -- Priority counties with documented FOG programs
  ('Miami-Dade', 'miami-dade', NULL, '25% capacity rule', 'DERM FOG Program', 'Grease Trap Cleaning in Miami-Dade, FL', 'Find licensed grease trap cleaning services in Miami-Dade County, Florida. Compare providers and get free quotes.'),
  ('Hillsborough', 'hillsborough', NULL, 'Every 90 days', 'Grease Management Program', 'Grease Trap Cleaning in Hillsborough, FL', 'Find licensed grease trap cleaning services in Hillsborough County, Florida. Compare providers and get free quotes.'),
  ('Pinellas', 'pinellas', NULL, 'Monthly (interceptors)', 'Commercial Grease Management', 'Grease Trap Cleaning in Pinellas, FL', 'Find licensed grease trap cleaning services in Pinellas County, Florida. Compare providers and get free quotes.'),
  ('Orange', 'orange', NULL, 'Per permit', 'FOG Control Program', 'Grease Trap Cleaning in Orange, FL', 'Find licensed grease trap cleaning services in Orange County, Florida. Compare providers and get free quotes.'),
  ('Duval', 'duval', NULL, 'Per permit', 'JEA Preferred Hauler Program', 'Grease Trap Cleaning in Duval, FL', 'Find licensed grease trap cleaning services in Duval County, Florida. Compare providers and get free quotes.'),
  ('Sarasota', 'sarasota', NULL, '30 days (traps), 90 days (interceptors)', 'FOG Program (since 2020)', 'Grease Trap Cleaning in Sarasota, FL', 'Find licensed grease trap cleaning services in Sarasota County, Florida. Compare providers and get free quotes.'),
  ('Palm Beach', 'palm-beach', NULL, 'Per permit', 'SWA Grease Program', 'Grease Trap Cleaning in Palm Beach, FL', 'Find licensed grease trap cleaning services in Palm Beach County, Florida. Compare providers and get free quotes.'),
  ('Broward', 'broward', NULL, 'Per permit', 'FOG Control', 'Grease Trap Cleaning in Broward, FL', 'Find licensed grease trap cleaning services in Broward County, Florida. Compare providers and get free quotes.'),
  ('Lee', 'lee', NULL, 'Per permit', 'FOG Ordinance', 'Grease Trap Cleaning in Lee, FL', 'Find licensed grease trap cleaning services in Lee County, Florida. Compare providers and get free quotes.'),
  ('Volusia', 'volusia', NULL, 'Per permit', 'FOG Program', 'Grease Trap Cleaning in Volusia, FL', 'Find licensed grease trap cleaning services in Volusia County, Florida. Compare providers and get free quotes.'),

  -- Remaining 57 counties (name and slug)
  ('Alachua', 'alachua', NULL, NULL, NULL, 'Grease Trap Cleaning in Alachua, FL', 'Find grease trap cleaning services in Alachua County, Florida.'),
  ('Baker', 'baker', NULL, NULL, NULL, 'Grease Trap Cleaning in Baker, FL', 'Find grease trap cleaning services in Baker County, Florida.'),
  ('Bay', 'bay', NULL, NULL, NULL, 'Grease Trap Cleaning in Bay, FL', 'Find grease trap cleaning services in Bay County, Florida.'),
  ('Bradford', 'bradford', NULL, NULL, NULL, 'Grease Trap Cleaning in Bradford, FL', 'Find grease trap cleaning services in Bradford County, Florida.'),
  ('Brevard', 'brevard', NULL, NULL, NULL, 'Grease Trap Cleaning in Brevard, FL', 'Find grease trap cleaning services in Brevard County, Florida.'),
  ('Calhoun', 'calhoun', NULL, NULL, NULL, 'Grease Trap Cleaning in Calhoun, FL', 'Find grease trap cleaning services in Calhoun County, Florida.'),
  ('Charlotte', 'charlotte', NULL, NULL, NULL, 'Grease Trap Cleaning in Charlotte, FL', 'Find grease trap cleaning services in Charlotte County, Florida.'),
  ('Citrus', 'citrus', NULL, NULL, NULL, 'Grease Trap Cleaning in Citrus, FL', 'Find grease trap cleaning services in Citrus County, Florida.'),
  ('Clay', 'clay', NULL, NULL, NULL, 'Grease Trap Cleaning in Clay, FL', 'Find grease trap cleaning services in Clay County, Florida.'),
  ('Collier', 'collier', NULL, NULL, NULL, 'Grease Trap Cleaning in Collier, FL', 'Find grease trap cleaning services in Collier County, Florida.'),
  ('Columbia', 'columbia', NULL, NULL, NULL, 'Grease Trap Cleaning in Columbia, FL', 'Find grease trap cleaning services in Columbia County, Florida.'),
  ('DeSoto', 'desoto', NULL, NULL, NULL, 'Grease Trap Cleaning in DeSoto, FL', 'Find grease trap cleaning services in DeSoto County, Florida.'),
  ('Dixie', 'dixie', NULL, NULL, NULL, 'Grease Trap Cleaning in Dixie, FL', 'Find grease trap cleaning services in Dixie County, Florida.'),
  ('Escambia', 'escambia', NULL, NULL, NULL, 'Grease Trap Cleaning in Escambia, FL', 'Find grease trap cleaning services in Escambia County, Florida.'),
  ('Flagler', 'flagler', NULL, NULL, NULL, 'Grease Trap Cleaning in Flagler, FL', 'Find grease trap cleaning services in Flagler County, Florida.'),
  ('Franklin', 'franklin', NULL, NULL, NULL, 'Grease Trap Cleaning in Franklin, FL', 'Find grease trap cleaning services in Franklin County, Florida.'),
  ('Gadsden', 'gadsden', NULL, NULL, NULL, 'Grease Trap Cleaning in Gadsden, FL', 'Find grease trap cleaning services in Gadsden County, Florida.'),
  ('Gilchrist', 'gilchrist', NULL, NULL, NULL, 'Grease Trap Cleaning in Gilchrist, FL', 'Find grease trap cleaning services in Gilchrist County, Florida.'),
  ('Glades', 'glades', NULL, NULL, NULL, 'Grease Trap Cleaning in Glades, FL', 'Find grease trap cleaning services in Glades County, Florida.'),
  ('Gulf', 'gulf', NULL, NULL, NULL, 'Grease Trap Cleaning in Gulf, FL', 'Find grease trap cleaning services in Gulf County, Florida.'),
  ('Hamilton', 'hamilton', NULL, NULL, NULL, 'Grease Trap Cleaning in Hamilton, FL', 'Find grease trap cleaning services in Hamilton County, Florida.'),
  ('Hardee', 'hardee', NULL, NULL, NULL, 'Grease Trap Cleaning in Hardee, FL', 'Find grease trap cleaning services in Hardee County, Florida.'),
  ('Hendry', 'hendry', NULL, NULL, NULL, 'Grease Trap Cleaning in Hendry, FL', 'Find grease trap cleaning services in Hendry County, Florida.'),
  ('Hernando', 'hernando', NULL, NULL, NULL, 'Grease Trap Cleaning in Hernando, FL', 'Find grease trap cleaning services in Hernando County, Florida.'),
  ('Highlands', 'highlands', NULL, NULL, NULL, 'Grease Trap Cleaning in Highlands, FL', 'Find grease trap cleaning services in Highlands County, Florida.'),
  ('Holmes', 'holmes', NULL, NULL, NULL, 'Grease Trap Cleaning in Holmes, FL', 'Find grease trap cleaning services in Holmes County, Florida.'),
  ('Indian River', 'indian-river', NULL, NULL, NULL, 'Grease Trap Cleaning in Indian River, FL', 'Find grease trap cleaning services in Indian River County, Florida.'),
  ('Jackson', 'jackson', NULL, NULL, NULL, 'Grease Trap Cleaning in Jackson, FL', 'Find grease trap cleaning services in Jackson County, Florida.'),
  ('Jefferson', 'jefferson', NULL, NULL, NULL, 'Grease Trap Cleaning in Jefferson, FL', 'Find grease trap cleaning services in Jefferson County, Florida.'),
  ('Lafayette', 'lafayette', NULL, NULL, NULL, 'Grease Trap Cleaning in Lafayette, FL', 'Find grease trap cleaning services in Lafayette County, Florida.'),
  ('Lake', 'lake', NULL, NULL, NULL, 'Grease Trap Cleaning in Lake, FL', 'Find grease trap cleaning services in Lake County, Florida.'),
  ('Leon', 'leon', NULL, NULL, NULL, 'Grease Trap Cleaning in Leon, FL', 'Find grease trap cleaning services in Leon County, Florida.'),
  ('Levy', 'levy', NULL, NULL, NULL, 'Grease Trap Cleaning in Levy, FL', 'Find grease trap cleaning services in Levy County, Florida.'),
  ('Liberty', 'liberty', NULL, NULL, NULL, 'Grease Trap Cleaning in Liberty, FL', 'Find grease trap cleaning services in Liberty County, Florida.'),
  ('Madison', 'madison', NULL, NULL, NULL, 'Grease Trap Cleaning in Madison, FL', 'Find grease trap cleaning services in Madison County, Florida.'),
  ('Manatee', 'manatee', NULL, NULL, NULL, 'Grease Trap Cleaning in Manatee, FL', 'Find grease trap cleaning services in Manatee County, Florida.'),
  ('Marion', 'marion', NULL, NULL, NULL, 'Grease Trap Cleaning in Marion, FL', 'Find grease trap cleaning services in Marion County, Florida.'),
  ('Martin', 'martin', NULL, NULL, NULL, 'Grease Trap Cleaning in Martin, FL', 'Find grease trap cleaning services in Martin County, Florida.'),
  ('Monroe', 'monroe', NULL, NULL, NULL, 'Grease Trap Cleaning in Monroe, FL', 'Find grease trap cleaning services in Monroe County, Florida.'),
  ('Nassau', 'nassau', NULL, NULL, NULL, 'Grease Trap Cleaning in Nassau, FL', 'Find grease trap cleaning services in Nassau County, Florida.'),
  ('Okaloosa', 'okaloosa', NULL, NULL, NULL, 'Grease Trap Cleaning in Okaloosa, FL', 'Find grease trap cleaning services in Okaloosa County, Florida.'),
  ('Okeechobee', 'okeechobee', NULL, NULL, NULL, 'Grease Trap Cleaning in Okeechobee, FL', 'Find grease trap cleaning services in Okeechobee County, Florida.'),
  ('Osceola', 'osceola', NULL, NULL, NULL, 'Grease Trap Cleaning in Osceola, FL', 'Find grease trap cleaning services in Osceola County, Florida.'),
  ('Pasco', 'pasco', NULL, NULL, NULL, 'Grease Trap Cleaning in Pasco, FL', 'Find grease trap cleaning services in Pasco County, Florida.'),
  ('Polk', 'polk', NULL, NULL, NULL, 'Grease Trap Cleaning in Polk, FL', 'Find grease trap cleaning services in Polk County, Florida.'),
  ('Putnam', 'putnam', NULL, NULL, NULL, 'Grease Trap Cleaning in Putnam, FL', 'Find grease trap cleaning services in Putnam County, Florida.'),
  ('Santa Rosa', 'santa-rosa', NULL, NULL, NULL, 'Grease Trap Cleaning in Santa Rosa, FL', 'Find grease trap cleaning services in Santa Rosa County, Florida.'),
  ('Seminole', 'seminole', NULL, NULL, NULL, 'Grease Trap Cleaning in Seminole, FL', 'Find grease trap cleaning services in Seminole County, Florida.'),
  ('St. Johns', 'st-johns', NULL, NULL, NULL, 'Grease Trap Cleaning in St. Johns, FL', 'Find grease trap cleaning services in St. Johns County, Florida.'),
  ('St. Lucie', 'st-lucie', NULL, NULL, NULL, 'Grease Trap Cleaning in St. Lucie, FL', 'Find grease trap cleaning services in St. Lucie County, Florida.'),
  ('Sumter', 'sumter', NULL, NULL, NULL, 'Grease Trap Cleaning in Sumter, FL', 'Find grease trap cleaning services in Sumter County, Florida.'),
  ('Suwannee', 'suwannee', NULL, NULL, NULL, 'Grease Trap Cleaning in Suwannee, FL', 'Find grease trap cleaning services in Suwannee County, Florida.'),
  ('Taylor', 'taylor', NULL, NULL, NULL, 'Grease Trap Cleaning in Taylor, FL', 'Find grease trap cleaning services in Taylor County, Florida.'),
  ('Union', 'union', NULL, NULL, NULL, 'Grease Trap Cleaning in Union, FL', 'Find grease trap cleaning services in Union County, Florida.'),
  ('Wakulla', 'wakulla', NULL, NULL, NULL, 'Grease Trap Cleaning in Wakulla, FL', 'Find grease trap cleaning services in Wakulla County, Florida.'),
  ('Walton', 'walton', NULL, NULL, NULL, 'Grease Trap Cleaning in Walton, FL', 'Find grease trap cleaning services in Walton County, Florida.'),
  ('Washington', 'washington', NULL, NULL, NULL, 'Grease Trap Cleaning in Washington, FL', 'Find grease trap cleaning services in Washington County, Florida.');

-- ============================================
-- VERIFY: Should be 67 counties
-- ============================================
-- SELECT COUNT(*) FROM counties; -- Expected: 67
