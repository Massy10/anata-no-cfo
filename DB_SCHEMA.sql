-- ============================================================
-- あなたのCFO — Supabase Database Schema v3.0
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  preferred_currency TEXT DEFAULT 'JPY' CHECK (preferred_currency IN ('JPY', 'USD')),
  preferred_locale TEXT DEFAULT 'ja' CHECK (preferred_locale IN ('ja', 'en')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  appearance_mode TEXT DEFAULT 'light' CHECK (appearance_mode IN ('light', 'dark', 'system')),
  cfo_name TEXT DEFAULT 'マネーの番人',
  goal_asset INTEGER DEFAULT 10000000,   -- in JPY (e.g. 10,000,000 = 1000万円)
  goal_cf INTEGER DEFAULT 100000,        -- monthly target CF in JPY
  cfo_chat_count INTEGER DEFAULT 0,
  cfo_chat_reset_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 2. TRANSACTIONS (income + expense)
-- ============================================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'JPY' CHECK (currency IN ('JPY', 'USD')),
  payment_method TEXT,         -- 支払手段 (layer 1)
  tag_ids TEXT[],              -- 用途タグ (layer 2, array of tag names)
  date DATE NOT NULL,
  memo TEXT,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'ocr')),
  is_fixed BOOLEAN DEFAULT FALSE,  -- 固定費/変動費 (layer 3)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_user_type ON transactions(user_id, type);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 3. CATEGORIES (用途タグ)
-- ============================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- NULL = system default
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  is_default BOOLEAN DEFAULT FALSE,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own + default categories" ON categories
  FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users can manage own categories" ON categories
  FOR ALL USING (auth.uid() = user_id);

-- Default categories (income)
INSERT INTO categories (name, type, is_default, icon, sort_order) VALUES
  ('給与', 'income', true, '💰', 1),
  ('副業収入', 'income', true, '💼', 2),
  ('投資収益', 'income', true, '📈', 3),
  ('その他収入', 'income', true, '🎁', 4);

-- Default categories (expense)
INSERT INTO categories (name, type, is_default, icon, sort_order) VALUES
  ('食費', 'expense', true, '🍽', 1),
  ('住居費', 'expense', true, '🏠', 2),
  ('水道光熱費', 'expense', true, '⚡', 3),
  ('通信費', 'expense', true, '📱', 4),
  ('交通費', 'expense', true, '🚃', 5),
  ('娯楽費', 'expense', true, '🎬', 6),
  ('医療費', 'expense', true, '🏥', 7),
  ('教育費', 'expense', true, '📚', 8),
  ('税金・社会保険', 'expense', true, '🏛', 9),
  ('その他', 'expense', true, '📦', 10);

-- ============================================================
-- 4. SUBSCRIPTIONS
-- ============================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'JPY',
  cycle TEXT DEFAULT '月額' CHECK (cycle IN ('月額', '年額', '週額')),
  next_payment_date DATE,
  card_id UUID REFERENCES credit_cards(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 5. LOANS
-- ============================================================
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  principal DECIMAL(14,2) NOT NULL,
  annual_rate DECIMAL(5,3) NOT NULL,  -- e.g. 0.475
  term_years INTEGER NOT NULL,
  start_date DATE,
  bank_name TEXT,
  icon TEXT DEFAULT '🏠',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own loans" ON loans
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 6. CREDIT CARDS
-- ============================================================
CREATE TABLE credit_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  last4 TEXT,
  closing_day INTEGER CHECK (closing_day BETWEEN 1 AND 31),
  payment_day INTEGER CHECK (payment_day BETWEEN 1 AND 31),
  credit_limit DECIMAL(12,2),
  color TEXT DEFAULT '#007AFF',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own cards" ON credit_cards
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 7. CARD TRANSACTIONS
-- ============================================================
CREATE TABLE card_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES credit_cards(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'JPY',
  date DATE NOT NULL,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE card_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own card transactions" ON card_transactions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 8. SCHEDULED EXPENSES
-- ============================================================
CREATE TABLE scheduled_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'JPY',
  scheduled_date DATE NOT NULL,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scheduled_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own scheduled expenses" ON scheduled_expenses
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 9. FX RATES (daily cache)
-- ============================================================
CREATE TABLE fx_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  base_currency TEXT NOT NULL DEFAULT 'USD',
  target_currency TEXT NOT NULL DEFAULT 'JPY',
  rate DECIMAL(10,4) NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, base_currency, target_currency)
);

-- No RLS needed (read-only, populated by Edge Function)
ALTER TABLE fx_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read fx rates" ON fx_rates FOR SELECT USING (true);

-- ============================================================
-- 10. SCHEDULED JOBS (pg_cron)
-- ============================================================

-- Monthly reset of CFO chat counter (1st of each month at 00:00 UTC)
SELECT cron.schedule(
  'reset-cfo-chat-monthly',
  '0 0 1 * *',
  $$UPDATE users SET cfo_chat_count = 0, cfo_chat_reset_at = NOW()$$
);

-- Daily FX rate fetch (00:05 UTC) — triggers Edge Function via HTTP
-- Note: Actual implementation calls the Edge Function endpoint
-- SELECT cron.schedule(
--   'fetch-fx-rate-daily',
--   '5 0 * * *',
--   $$SELECT net.http_post('https://YOUR_PROJECT.supabase.co/functions/v1/fetch-fx-rate', '{}', '{"Authorization": "Bearer SERVICE_ROLE_KEY"}')$$
-- );

-- ============================================================
-- 11. HELPER FUNCTIONS
-- ============================================================

-- Get current FX rate (with fallback)
CREATE OR REPLACE FUNCTION get_fx_rate(p_date DATE DEFAULT CURRENT_DATE)
RETURNS DECIMAL AS $$
DECLARE
  v_rate DECIMAL;
BEGIN
  SELECT rate INTO v_rate FROM fx_rates
  WHERE date <= p_date AND base_currency = 'USD' AND target_currency = 'JPY'
  ORDER BY date DESC LIMIT 1;
  
  RETURN COALESCE(v_rate, 149.50);  -- fallback rate
END;
$$ LANGUAGE plpgsql;

-- Calculate monthly loan payment (元利均等返済)
CREATE OR REPLACE FUNCTION calc_monthly_payment(
  p_principal DECIMAL,
  p_annual_rate DECIMAL,
  p_years INTEGER
) RETURNS DECIMAL AS $$
DECLARE
  v_monthly_rate DECIMAL;
  v_n INTEGER;
BEGIN
  IF p_annual_rate = 0 THEN
    RETURN ROUND(p_principal / (p_years * 12));
  END IF;
  v_monthly_rate := p_annual_rate / 100.0 / 12.0;
  v_n := p_years * 12;
  RETURN ROUND(p_principal * v_monthly_rate * POWER(1 + v_monthly_rate, v_n) / (POWER(1 + v_monthly_rate, v_n) - 1));
END;
$$ LANGUAGE plpgsql;
