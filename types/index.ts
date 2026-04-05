export interface User {
  id: string;
  email: string;
  display_name: string;
  preferred_currency: 'JPY' | 'USD';
  preferred_locale: 'ja' | 'en';
  plan: 'free' | 'pro';
  appearance_mode: 'light' | 'dark' | 'system';
  cfo_name: string;
  goal_asset: number;
  goal_cf: number;
  cfo_chat_count: number;
  cfo_chat_reset_at: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: 'JPY' | 'USD';
  payment_method: string;
  tag_ids: string[];
  date: string;
  memo: string;
  source: 'manual' | 'ocr';
  is_fixed: boolean;
  created_at: string;
  // UI-only fields
  name?: string;
  icon?: string;
  tag?: string;
}

export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  type: 'income' | 'expense';
  is_default: boolean;
  icon: string;
  sort_order: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  currency: string;
  cycle: '\u6708\u984d' | '\u5e74\u984d' | '\u9031\u984d';
  next_payment_date: string;
  card_id: string;
  icon: string;
  card?: string; // card name for display
}

export interface Loan {
  id: string;
  user_id: string;
  name: string;
  principal: number;
  annual_rate: number;
  term_years: number;
  start_date: string;
  bank_name: string;
  icon: string;
}

export interface CreditCard {
  id: string;
  user_id: string;
  name: string;
  last4: string;
  closing_day: number;
  payment_day: number;
  credit_limit: number;
  color: string;
  balance?: number; // calculated
}

export interface ScheduledExpense {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  currency: string;
  scheduled_date: string;
  memo: string;
  icon: string;
  days?: number; // calculated days until
}

export interface FxRate {
  id: string;
  date: string;
  base_currency: string;
  target_currency: string;
  rate: number;
  fetched_at: string;
}

export interface ChartData {
  m: string;
  inc: number;
  exp: number;
}

export interface CfoProfile {
  cfoName: string;
  goalAsset: number;
  goalCf: number;
}

export type Colors = {
  bg: string;
  bg2: string;
  bg3: string;
  fill: string;
  blue: string;
  green: string;
  red: string;
  orange: string;
  yellow: string;
  purple: string;
  cyan: string;
  t1: string;
  t2: string;
  t3: string;
  sep: string;
  tabBg: string;
  heroGlass: string;
  heroBorder: string;
  heroShadow: string;
  cardShadow: string;
};
