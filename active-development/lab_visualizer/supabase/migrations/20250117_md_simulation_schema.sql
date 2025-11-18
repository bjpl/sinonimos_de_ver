-- Migration: MD Simulation Tables and Policies
-- Created: 2025-01-17
-- Description: Database schema for OpenMM Edge Function simulation worker

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- MD Jobs table
CREATE TABLE IF NOT EXISTS md_jobs (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'queued', 'running', 'completed', 'failed', 'cancelled')),
  config JSONB NOT NULL,
  structure_id TEXT,
  structure_data TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  result_url TEXT,
  energy_plot_url TEXT,
  statistics_url TEXT,
  log_url TEXT,
  error_message TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  estimated_time_remaining INTEGER DEFAULT 0,
  frame_count INTEGER,
  final_energy NUMERIC,
  average_temperature NUMERIC,
  average_pressure NUMERIC
);

-- Simulation costs tracking
CREATE TABLE IF NOT EXISTS simulation_costs (
  id SERIAL PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES md_jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  execution_time_seconds INTEGER NOT NULL CHECK (execution_time_seconds >= 0),
  cost_usd NUMERIC(10, 4) NOT NULL CHECK (cost_usd >= 0),
  atom_count INTEGER NOT NULL CHECK (atom_count > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User quotas table
CREATE TABLE IF NOT EXISTS user_quotas (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_limit INTEGER NOT NULL DEFAULT 5,
  monthly_limit INTEGER NOT NULL DEFAULT 100,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  last_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Simulation cache table (for popular structures)
CREATE TABLE IF NOT EXISTS simulation_cache (
  id SERIAL PRIMARY KEY,
  structure_id TEXT NOT NULL UNIQUE,
  trajectory_url TEXT NOT NULL,
  energy_url TEXT NOT NULL,
  config JSONB NOT NULL,
  hit_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_md_jobs_user_id ON md_jobs(user_id);
CREATE INDEX idx_md_jobs_status ON md_jobs(status);
CREATE INDEX idx_md_jobs_created_at ON md_jobs(created_at DESC);
CREATE INDEX idx_simulation_costs_user_id ON simulation_costs(user_id);
CREATE INDEX idx_simulation_costs_created_at ON simulation_costs(created_at DESC);
CREATE INDEX idx_simulation_cache_structure_id ON simulation_cache(structure_id);
CREATE INDEX idx_simulation_cache_hit_count ON simulation_cache(hit_count DESC);

-- Enable Row Level Security
ALTER TABLE md_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for md_jobs
CREATE POLICY "Users can view own jobs"
  ON md_jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs"
  ON md_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs"
  ON md_jobs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can do anything"
  ON md_jobs FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policies for simulation_costs
CREATE POLICY "Users can view own costs"
  ON simulation_costs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert costs"
  ON simulation_costs FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- RLS Policies for user_quotas
CREATE POLICY "Users can view own quota"
  ON user_quotas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage quotas"
  ON user_quotas FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policies for simulation_cache
CREATE POLICY "Anyone can view cache"
  ON simulation_cache FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage cache"
  ON simulation_cache FOR ALL
  USING (auth.role() = 'service_role');

-- Function to check daily quota
CREATE OR REPLACE FUNCTION check_daily_quota(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_quota INTEGER;
  v_used INTEGER;
BEGIN
  -- Get user's daily limit
  SELECT daily_limit INTO v_quota
  FROM user_quotas
  WHERE user_id = p_user_id;

  -- If no quota record, create one with defaults
  IF v_quota IS NULL THEN
    INSERT INTO user_quotas (user_id, daily_limit)
    VALUES (p_user_id, 5)
    ON CONFLICT (user_id) DO NOTHING;
    v_quota := 5;
  END IF;

  -- Count today's jobs
  SELECT COUNT(*) INTO v_used
  FROM md_jobs
  WHERE user_id = p_user_id
    AND created_at >= CURRENT_DATE;

  -- Return true if under quota
  RETURN v_used < v_quota;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment cache hit count
CREATE OR REPLACE FUNCTION increment_cache_hit(p_structure_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE simulation_cache
  SET hit_count = hit_count + 1,
      last_accessed_at = NOW()
  WHERE structure_id = p_structure_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's simulation statistics
CREATE OR REPLACE FUNCTION get_user_simulation_stats(p_user_id UUID)
RETURNS TABLE (
  total_jobs BIGINT,
  completed_jobs BIGINT,
  failed_jobs BIGINT,
  total_cost NUMERIC,
  avg_execution_time NUMERIC,
  total_atoms_simulated BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_jobs,
    COUNT(*) FILTER (WHERE j.status = 'completed')::BIGINT as completed_jobs,
    COUNT(*) FILTER (WHERE j.status = 'failed')::BIGINT as failed_jobs,
    COALESCE(SUM(c.cost_usd), 0) as total_cost,
    COALESCE(AVG(c.execution_time_seconds), 0) as avg_execution_time,
    COALESCE(SUM(c.atom_count), 0)::BIGINT as total_atoms_simulated
  FROM md_jobs j
  LEFT JOIN simulation_costs c ON j.id = c.job_id
  WHERE j.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_quotas_updated_at
  BEFORE UPDATE ON user_quotas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE ON md_jobs TO authenticated;
GRANT SELECT ON simulation_costs TO authenticated;
GRANT SELECT ON user_quotas TO authenticated;
GRANT SELECT ON simulation_cache TO authenticated;

-- Comments for documentation
COMMENT ON TABLE md_jobs IS 'Tracks molecular dynamics simulation jobs';
COMMENT ON TABLE simulation_costs IS 'Tracks execution costs for simulations';
COMMENT ON TABLE user_quotas IS 'User-specific quota limits and tiers';
COMMENT ON TABLE simulation_cache IS 'Caches popular simulation results';
COMMENT ON FUNCTION check_daily_quota IS 'Check if user has remaining daily quota';
COMMENT ON FUNCTION increment_cache_hit IS 'Increment cache hit counter';
COMMENT ON FUNCTION get_user_simulation_stats IS 'Get user simulation statistics';
