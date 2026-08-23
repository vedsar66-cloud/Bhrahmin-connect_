-- ==============================================================================
-- SAMAJ SETU: Supabase (PostgreSQL Free Tier) Schema & Row Level Security (RLS)
-- ==============================================================================

-- 1. Profiles Table (linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  full_name_gu TEXT,
  email TEXT,
  gotra TEXT NOT NULL,
  native_village TEXT NOT NULL,
  current_city TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  occupation TEXT,
  company_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_donor BOOLEAN DEFAULT false,
  last_donation_date DATE,
  is_verified BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'volunteer')),
  family_members JSONB DEFAULT '[]'::jsonb,
  privacy JSONB DEFAULT '{"showPhone": true, "showWhatsapp": true, "allowDirectContact": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Directory Members Table
CREATE TABLE IF NOT EXISTS public.directory_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  full_name_gu TEXT,
  gotra TEXT NOT NULL,
  native_village TEXT NOT NULL,
  current_city TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  occupation TEXT,
  avatar_url TEXT,
  family_count INT DEFAULT 1,
  is_verified BOOLEAN DEFAULT true,
  is_donor BOOLEAN DEFAULT false,
  bio TEXT,
  address TEXT,
  family_members JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Blood Donors Table
CREATE TABLE IF NOT EXISTS public.blood_donors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  full_name_gu TEXT,
  blood_group TEXT NOT NULL,
  current_city TEXT NOT NULL,
  native_village TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  last_donation_date DATE,
  is_available BOOLEAN DEFAULT true,
  donation_count INT DEFAULT 0,
  is_emergency_ready BOOLEAN DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Emergency Blood Requests Table
CREATE TABLE IF NOT EXISTS public.blood_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  units_required INT NOT NULL DEFAULT 1,
  hospital_name TEXT NOT NULL,
  hospital_address TEXT NOT NULL,
  city TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  urgency TEXT DEFAULT 'critical' CHECK (urgency IN ('critical', 'high', 'moderate')),
  reason TEXT,
  is_fulfilled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Business Network Table
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  name_gu TEXT,
  category TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  native_village TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  website TEXT,
  description TEXT NOT NULL,
  description_gu TEXT,
  special_offer TEXT,
  special_offer_gu TEXT,
  image_url TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT true,
  established_year INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Samaj Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_gu TEXT NOT NULL,
  description TEXT NOT NULL,
  description_gu TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT,
  category TEXT DEFAULT 'event',
  is_urgent BOOLEAN DEFAULT false,
  image_url TEXT,
  organizer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.directory_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Read policies (Public / Community Read)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Directory is viewable by everyone" ON public.directory_members FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert directory entries" ON public.directory_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Blood donors viewable by all" ON public.blood_donors FOR SELECT USING (true);
CREATE POLICY "Users can register as blood donor" ON public.blood_donors FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Blood requests viewable by all" ON public.blood_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can post urgent blood request" ON public.blood_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Businesses viewable by all" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Authenticated users can register business" ON public.businesses FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Announcements viewable by all" ON public.announcements FOR SELECT USING (true);

-- Indexes for lightning fast mobile search
CREATE INDEX IF NOT EXISTS idx_directory_gotra ON public.directory_members (gotra);
CREATE INDEX IF NOT EXISTS idx_directory_village ON public.directory_members (native_village);
CREATE INDEX IF NOT EXISTS idx_blood_group ON public.blood_donors (blood_group, is_available);
CREATE INDEX IF NOT EXISTS idx_business_cat ON public.businesses (category);
