-- API Usage Tracking Tables

-- Table for tracking individual API requests
CREATE TABLE IF NOT EXISTS public.api_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.user_sessions(id) ON DELETE SET NULL,
  project_name TEXT,
  model TEXT NOT NULL,
  provider TEXT, -- openai, anthropic, etc.
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  cost DECIMAL(10, 6) DEFAULT 0,
  response_time_ms INTEGER,
  status TEXT CHECK (status IN ('success', 'error', 'timeout')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for desktop app state (for remote control)
CREATE TABLE IF NOT EXISTS public.desktop_app_state (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.user_sessions(id) ON DELETE CASCADE,
  device_name TEXT,
  is_online BOOLEAN DEFAULT false,
  last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
  running_apps JSONB DEFAULT '[]'::jsonb,
  system_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for build logs
CREATE TABLE IF NOT EXISTS public.build_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_state_id UUID REFERENCES public.desktop_app_state(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  build_status TEXT CHECK (build_status IN ('started', 'in_progress', 'success', 'failed')),
  log_content TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER
);

-- Table for remote commands (web → desktop)
CREATE TABLE IF NOT EXISTS public.remote_commands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_session_id UUID REFERENCES public.user_sessions(id) ON DELETE CASCADE,
  command_type TEXT NOT NULL CHECK (command_type IN ('start_app', 'stop_app', 'build', 'deploy', 'sync_settings')),
  command_data JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'completed', 'failed')),
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  executed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON public.api_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_model ON public.api_usage(model);
CREATE INDEX IF NOT EXISTS idx_desktop_app_state_user_id ON public.desktop_app_state(user_id);
CREATE INDEX IF NOT EXISTS idx_desktop_app_state_session_id ON public.desktop_app_state(session_id);
CREATE INDEX IF NOT EXISTS idx_build_logs_user_id ON public.build_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_remote_commands_user_id ON public.remote_commands(user_id);
CREATE INDEX IF NOT EXISTS idx_remote_commands_status ON public.remote_commands(status);

-- Enable Row Level Security
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desktop_app_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.build_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remote_commands ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_usage
CREATE POLICY "Users can view their own API usage"
  ON public.api_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API usage"
  ON public.api_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for desktop_app_state
CREATE POLICY "Users can view their own desktop app state"
  ON public.desktop_app_state FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own desktop app state"
  ON public.desktop_app_state FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for build_logs
CREATE POLICY "Users can view their own build logs"
  ON public.build_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own build logs"
  ON public.build_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for remote_commands
CREATE POLICY "Users can manage their own remote commands"
  ON public.remote_commands FOR ALL
  USING (auth.uid() = user_id);

-- Function to calculate aggregated stats
CREATE OR REPLACE FUNCTION get_user_analytics(
  p_user_id UUID,
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  total_tokens BIGINT,
  total_cost DECIMAL,
  total_requests BIGINT,
  avg_response_time DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(total_tokens), 0)::BIGINT as total_tokens,
    COALESCE(SUM(cost), 0)::DECIMAL as total_cost,
    COUNT(*)::BIGINT as total_requests,
    COALESCE(AVG(response_time_ms), 0)::DECIMAL as avg_response_time
  FROM public.api_usage
  WHERE user_id = p_user_id
    AND created_at >= p_start_date
    AND created_at <= p_end_date
    AND status = 'success';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get daily usage breakdown
CREATE OR REPLACE FUNCTION get_daily_usage(
  p_user_id UUID,
  p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
  date DATE,
  tokens BIGINT,
  cost DECIMAL,
  requests BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(created_at) as date,
    SUM(total_tokens)::BIGINT as tokens,
    SUM(cost)::DECIMAL as cost,
    COUNT(*)::BIGINT as requests
  FROM public.api_usage
  WHERE user_id = p_user_id
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL
    AND status = 'success'
  GROUP BY DATE(created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON public.api_usage TO authenticated;
GRANT ALL ON public.desktop_app_state TO authenticated;
GRANT ALL ON public.build_logs TO authenticated;
GRANT ALL ON public.remote_commands TO authenticated;
