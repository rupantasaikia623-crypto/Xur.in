-- =====================================================================
-- XUR MUSIC PLATFORM - COMPLETE SUPABASE DATABASE SCHEMA & POLICIES
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/zgopsdtrleojiuvwvnnm/sql)
-- =====================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user',
  favorites TEXT[] DEFAULT '{}',
  following TEXT[] DEFAULT '{}',
  followers TEXT[] DEFAULT '{}',
  submitted_songs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Automatic Profile Creation Trigger for Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'displayName', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. SONGS TABLE
CREATE TABLE IF NOT EXISTS public.songs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  language TEXT NOT NULL,
  album TEXT DEFAULT 'Single',
  release_year INT DEFAULT 2024,
  genre TEXT DEFAULT 'Folk',
  tags TEXT[] DEFAULT '{}',
  lyrics TEXT NOT NULL,
  transliteration TEXT,
  translation TEXT,
  youtube_link TEXT,
  submitted_by TEXT,
  submitted_by_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  views INT DEFAULT 0,
  upvotes_count INT DEFAULT 0,
  upvoted_by TEXT[] DEFAULT '{}',
  comments_count INT DEFAULT 0,
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT
);

ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Songs are viewable by everyone" ON public.songs;
CREATE POLICY "Songs are viewable by everyone" ON public.songs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert songs" ON public.songs;
CREATE POLICY "Anyone can insert songs" ON public.songs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update songs" ON public.songs;
CREATE POLICY "Anyone can update songs" ON public.songs FOR UPDATE USING (true);


-- 3. USER SUBMITTED LYRICS TABLE
CREATE TABLE IF NOT EXISTS public.user_submitted_lyrics (
  song_id TEXT PRIMARY KEY,
  lyrics TEXT NOT NULL,
  transliteration TEXT,
  translation TEXT,
  submitted_by TEXT,
  submitted_by_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_submitted_lyrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User submitted lyrics viewable by everyone" ON public.user_submitted_lyrics;
CREATE POLICY "User submitted lyrics viewable by everyone" ON public.user_submitted_lyrics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can upsert user submitted lyrics" ON public.user_submitted_lyrics;
CREATE POLICY "Anyone can upsert user submitted lyrics" ON public.user_submitted_lyrics FOR ALL USING (true);


-- 4. SONG VERSIONS TABLE
CREATE TABLE IF NOT EXISTS public.song_versions (
  id TEXT PRIMARY KEY,
  song_id TEXT NOT NULL,
  lyrics TEXT NOT NULL,
  transliteration TEXT,
  translation TEXT,
  edited_by TEXT,
  edited_by_username TEXT,
  edit_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.song_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Song versions viewable by everyone" ON public.song_versions;
CREATE POLICY "Song versions viewable by everyone" ON public.song_versions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert song versions" ON public.song_versions;
CREATE POLICY "Anyone can insert song versions" ON public.song_versions FOR INSERT WITH CHECK (true);


-- 5. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY,
  song_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  parent_id TEXT,
  upvotes TEXT[] DEFAULT '{}',
  reactions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_flagged BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments viewable by everyone" ON public.comments;
CREATE POLICY "Comments viewable by everyone" ON public.comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert comments" ON public.comments;
CREATE POLICY "Anyone can insert comments" ON public.comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update comments" ON public.comments;
CREATE POLICY "Anyone can update comments" ON public.comments FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete comments" ON public.comments;
CREATE POLICY "Anyone can delete comments" ON public.comments FOR DELETE USING (true);


-- 6. FEEDBACKS TABLE
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  username TEXT,
  rating INT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  song_id TEXT,
  song_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Feedbacks viewable by everyone" ON public.feedbacks;
CREATE POLICY "Feedbacks viewable by everyone" ON public.feedbacks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.feedbacks;
CREATE POLICY "Anyone can insert feedback" ON public.feedbacks FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete feedback" ON public.feedbacks;
CREATE POLICY "Anyone can delete feedback" ON public.feedbacks FOR DELETE USING (true);


-- 7. CONTACT MESSAGES & SUBSCRIBERS TABLES
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.subscribers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;
CREATE POLICY "Anyone can subscribe" ON public.subscribers FOR INSERT WITH CHECK (true);


-- 8. USER ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.user_activities (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  username TEXT,
  action_type TEXT NOT NULL,
  details TEXT,
  song_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Activities viewable by everyone" ON public.user_activities;
CREATE POLICY "Activities viewable by everyone" ON public.user_activities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert activity" ON public.user_activities;
CREATE POLICY "Anyone can insert activity" ON public.user_activities FOR INSERT WITH CHECK (true);


-- 9. FLAGS TABLE
CREATE TABLE IF NOT EXISTS public.flags (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  reported_by TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Flags viewable by everyone" ON public.flags;
CREATE POLICY "Flags viewable by everyone" ON public.flags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can report flag" ON public.flags;
CREATE POLICY "Anyone can report flag" ON public.flags FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Flags manageable" ON public.flags;
CREATE POLICY "Flags manageable" ON public.flags FOR UPDATE USING (true);


-- 10. SYSTEM STATS TABLE
CREATE TABLE IF NOT EXISTS public.system_stats (
  id TEXT PRIMARY KEY DEFAULT 'stats',
  page_views INT DEFAULT 12480
);

ALTER TABLE public.system_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "System stats viewable by everyone" ON public.system_stats;
CREATE POLICY "System stats viewable by everyone" ON public.system_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "System stats manageable" ON public.system_stats;
CREATE POLICY "System stats manageable" ON public.system_stats FOR ALL USING (true);

INSERT INTO public.system_stats (id, page_views)
VALUES ('stats', 12480)
ON CONFLICT (id) DO NOTHING;
