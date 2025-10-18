-- User Apps Sync - Sync desktop apps to web for remote management

CREATE TABLE IF NOT EXISTS public.user_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  desktop_app_id INTEGER NOT NULL, -- ID from desktop app's SQLite
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  description TEXT,
  framework TEXT,
  tech_stack JSONB DEFAULT '{}'::jsonb,
  github_repo TEXT,
  vercel_project_id TEXT,
  supabase_project_id TEXT,
  neon_project_id TEXT,
  is_capacitor BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, desktop_app_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_apps_user_id ON public.user_apps(user_id);
CREATE INDEX IF NOT EXISTS idx_user_apps_name ON public.user_apps(name);
CREATE INDEX IF NOT EXISTS idx_user_apps_created_at ON public.user_apps(created_at DESC);

-- Enable RLS
ALTER TABLE public.user_apps ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own apps"
  ON public.user_apps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own apps"
  ON public.user_apps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own apps"
  ON public.user_apps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own apps"
  ON public.user_apps FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.user_apps TO authenticated;
GRANT ALL ON public.user_apps TO service_role;
