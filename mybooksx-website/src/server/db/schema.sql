-- MyBooksX Database Schema for Cloudflare D1 & SQLite
-- Fully indexed relational design with complete audit logging

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  is_verified INTEGER NOT NULL DEFAULT 0,
  verification_code TEXT,
  verification_expires_at TEXT,
  points_balance INTEGER NOT NULL DEFAULT 0,
  points_reserved INTEGER NOT NULL DEFAULT 0,
  total_points_earned INTEGER NOT NULL DEFAULT 0,
  role TEXT NOT NULL DEFAULT 'user',
  google_id TEXT,
  avatar_url TEXT,
  auth_provider TEXT NOT NULL DEFAULT 'email',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_points ON users(points_balance);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token_hash);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Medium',
  options_json TEXT NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);

CREATE TABLE IF NOT EXISTS quiz_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL, -- 'daily' | 'practice'
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress' | 'completed' | 'abandoned'
  total_questions INTEGER NOT NULL DEFAULT 5,
  current_question_index INTEGER NOT NULL DEFAULT 0,
  questions_list_json TEXT NOT NULL,
  current_question_started_at TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  total_points INTEGER NOT NULL DEFAULT 0,
  started_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user ON quiz_sessions(user_id, mode, started_at);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_status ON quiz_sessions(status);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
  selected_index INTEGER NOT NULL,
  is_correct INTEGER NOT NULL,
  response_time_ms INTEGER NOT NULL,
  points_awarded INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(session_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_user ON quiz_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_session ON quiz_answers(session_id);

CREATE TABLE IF NOT EXISTS points_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'quiz_reward' | 'redemption_reserve' | 'redemption_deduct' | 'redemption_refund' | 'admin_adjustment'
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  description TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_points_tx_user ON points_transactions(user_id, created_at);

CREATE TABLE IF NOT EXISTS leaderboard_records (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  questions_answered INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  accuracy_pct REAL NOT NULL DEFAULT 0.0,
  weekly_points INTEGER NOT NULL DEFAULT 0,
  last_answered_at TEXT,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_points ON leaderboard_records(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_weekly ON leaderboard_records(weekly_points DESC);

CREATE TABLE IF NOT EXISTS rewards (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points_cost INTEGER NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 30,
  is_active INTEGER NOT NULL DEFAULT 1,
  icon_name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rewards_cost ON rewards(points_cost);

CREATE TABLE IF NOT EXISTS redemption_requests (
  id TEXT PRIMARY KEY,
  redemption_code TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id TEXT NOT NULL REFERENCES rewards(id) ON DELETE RESTRICT,
  points_reserved INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending' | 'Approved' | 'Rejected'
  rejection_reason TEXT,
  delivery_details TEXT,
  admin_notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_redemptions_user ON redemption_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_status ON redemption_requests(status);
CREATE INDEX IF NOT EXISTS idx_redemptions_created ON redemption_requests(created_at DESC);

CREATE TABLE IF NOT EXISTS active_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id TEXT NOT NULL REFERENCES rewards(id) ON DELETE RESTRICT,
  redemption_id TEXT NOT NULL REFERENCES redemption_requests(id) ON DELETE RESTRICT,
  starts_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  license_key TEXT,
  access_url TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'expired' | 'revoked'
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_active_subs_user ON active_subscriptions(user_id, status);

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_email ON admin_users(email);

CREATE TABLE IF NOT EXISTS oauth_states (
  state TEXT PRIMARY KEY,
  nonce TEXT NOT NULL,
  code_verifier TEXT NOT NULL,
  redirect_uri TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

-- 11. System Settings & Dynamic Configuration Table
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);


