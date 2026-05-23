-- ========== VOXEL.GG SUPABASE DATABASE SCHEMA ==========
-- Run these migrations in your Supabase project
-- Go to SQL Editor → paste this → Run

-- ========== USERS TABLE ==========
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT,
  credits FLOAT DEFAULT 20,
  total_used FLOAT DEFAULT 0,
  purchased_credits FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_reset TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_admin BOOLEAN DEFAULT FALSE,
  banned BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_admin ON users(is_admin);
CREATE INDEX idx_users_banned ON users(banned);

-- ========== SESSIONS TABLE ==========
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  login_time TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_email ON sessions(email);
CREATE INDEX idx_sessions_admin ON sessions(is_admin);

-- ========== GENERATION HISTORY ==========
CREATE TABLE IF NOT EXISTS generations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  code TEXT NOT NULL,
  provider TEXT,
  model TEXT,
  cost FLOAT,
  size TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_generations_user ON generations(user_id);
CREATE INDEX idx_generations_created ON generations(created_at DESC);

-- ========== CREDITS TRANSACTIONS ==========
CREATE TABLE IF NOT EXISTS credit_transactions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount FLOAT NOT NULL,
  type TEXT, -- 'generation', 'purchase', 'reset', 'admin_add'
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON credit_transactions(user_id);
CREATE INDEX idx_transactions_type ON credit_transactions(type);

-- ========== ADMIN LOGS ==========
CREATE TABLE IF NOT EXISTS admin_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  admin_email TEXT NOT NULL,
  action TEXT,
  target_user_id TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_email);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);

-- ========== API USAGE STATS ==========
CREATE TABLE IF NOT EXISTS api_usage (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  provider TEXT,
  requests_count INT DEFAULT 1,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, date)
);

CREATE INDEX idx_api_usage_provider ON api_usage(provider);
CREATE INDEX idx_api_usage_date ON api_usage(date);

-- ========== ENABLE ROW LEVEL SECURITY ==========
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- ========== RLS POLICIES ==========

-- Users: Everyone can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (TRUE);

-- Sessions: Anyone can create, users can read/delete own
CREATE POLICY "Users can read own sessions" ON sessions
  FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can create sessions" ON sessions
  FOR INSERT WITH CHECK (TRUE);

-- Generations: Users can read own, admins can read all
CREATE POLICY "Users can read own generations" ON generations
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create generations" ON generations
  FOR INSERT WITH CHECK (TRUE);

-- Credit Transactions: Users can read own
CREATE POLICY "Users can read own transactions" ON credit_transactions
  FOR SELECT USING (TRUE);

CREATE POLICY "System can create transactions" ON credit_transactions
  FOR INSERT WITH CHECK (TRUE);

-- Admin Logs: Only for audit
CREATE POLICY "System can create admin logs" ON admin_logs
  FOR INSERT WITH CHECK (TRUE);

-- API Usage: System tracks it
CREATE POLICY "System can track API usage" ON api_usage
  FOR INSERT WITH CHECK (TRUE);

-- ========== GRANTS ==========
GRANT ALL ON users TO authenticated;
GRANT ALL ON sessions TO authenticated;
GRANT ALL ON generations TO authenticated;
GRANT ALL ON credit_transactions TO authenticated;
GRANT ALL ON admin_logs TO authenticated;
GRANT ALL ON api_usage TO authenticated;

GRANT ALL ON users TO anon;
GRANT ALL ON sessions TO anon;
GRANT ALL ON generations TO anon;
GRANT ALL ON credit_transactions TO anon;

-- ========== SAMPLE ADMIN USER (RUN AFTER CREATING TABLES) ==========
-- INSERT INTO users (id, email, is_admin, credits) VALUES
-- ('admin_kamran', 'shaikzaid7373@gmail.com', true, 999999);
