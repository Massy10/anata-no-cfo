import type { ChartData } from '@/types';

export const incomeData = [
  { id: '101', name: '給与', amount: 280000, payment_method: '振込', tag: '給与', date: '3月25日', icon: '💰', currency: 'JPY' as const },
  { id: '102', name: '副業報酬', amount: 85000, payment_method: '振込', tag: '副業', date: '4月3日', icon: '💼', currency: 'JPY' as const },
  { id: '103', name: '配当金', amount: 12500, payment_method: '証券', tag: '投資', date: '3月31日', icon: '📈', currency: 'JPY' as const },
  { id: '104', name: 'アプリ収益', amount: 3200, payment_method: '振込', tag: '副業', date: '3月28日', icon: '📱', currency: 'JPY' as const },
  { id: '105', name: 'ポイント換金', amount: 1500, payment_method: '電子マネー', tag: 'その他', date: '3月20日', icon: '🎁', currency: 'JPY' as const },
  { id: '106', name: '海外案件報酬', amount: 500, payment_method: 'PayPal', tag: '副業', date: '4月3日', icon: '🌐', currency: 'USD' as const },
];

export const expenseData = [
  { id: '1', name: 'コンビニ', amount: 680, payment_method: 'PayPay', tag: '食費', date: '4月4日', type: 'variable', icon: '🍙', currency: 'JPY' as const },
  { id: '2', name: 'Netflix', amount: 1490, payment_method: 'クレカ', tag: 'サブスク', date: '4月1日', type: 'fixed', icon: '🎬', currency: 'JPY' as const },
  { id: '3', name: '電気代', amount: 8500, payment_method: '引落', tag: '光熱費', date: '4月1日', type: 'fixed', icon: '⚡', currency: 'JPY' as const },
  { id: '4', name: 'ランチ', amount: 1200, payment_method: '現金', tag: '食費', date: '3月30日', type: 'variable', icon: '🍽', currency: 'JPY' as const },
  { id: '5', name: 'Suica', amount: 5000, payment_method: 'クレカ', tag: '交通費', date: '3月29日', type: 'variable', icon: '🚃', currency: 'JPY' as const },
  { id: '6', name: '家賃', amount: 85000, payment_method: '引落', tag: '住居費', date: '3月27日', type: 'fixed', icon: '🏠', currency: 'JPY' as const },
  { id: '7', name: 'Amazon US', amount: 29.99, payment_method: 'クレカ', tag: '娯楽費', date: '3月24日', type: 'variable', icon: '📦', currency: 'USD' as const },
  { id: '8', name: 'スマホ代', amount: 4800, payment_method: '引落', tag: '通信費', date: '3月26日', type: 'fixed', icon: '📱', currency: 'JPY' as const },
];

export const subscriptionsData = [
  { id: '1', name: 'Netflix', amount: 1490, next_payment_date: '5月1日', card: '三井住友', icon: '🎬', cycle: '月額' as const },
  { id: '2', name: 'Spotify', amount: 980, next_payment_date: '4月15日', card: '楽天', icon: '🎵', cycle: '月額' as const },
  { id: '3', name: 'iCloud+', amount: 400, next_payment_date: '4月20日', card: '三井住友', icon: '☁️', cycle: '月額' as const },
  { id: '4', name: 'ChatGPT Plus', amount: 3000, next_payment_date: '4月22日', card: '楽天', icon: '🤖', cycle: '月額' as const },
  { id: '5', name: 'Adobe CC', amount: 6480, next_payment_date: '5月5日', card: '三井住友', icon: '🎨', cycle: '月額' as const },
];

export const creditCardsData = [
  { id: '1', name: '三井住友カード', last4: '4521', balance: 145000, credit_limit: 500000, closing_day: 15, payment_day: 10, color: '#00A650' },
  { id: '2', name: '楽天カード', last4: '8832', balance: 68000, credit_limit: 300000, closing_day: 25, payment_day: 27, color: '#BF0000' },
];

export const scheduledExpensesData = [
  { id: '1', name: '結婚式（友人）', amount: 300000, scheduled_date: '2026年8月10日', days: 128, icon: '💒', memo: 'ご祝儀＋交通費', type: 'variable' as const },
  { id: '2', name: '車検', amount: 120000, scheduled_date: '2026年11月', days: 210, icon: '🚗', memo: 'ディーラー見積もり', type: 'variable' as const },
  { id: '3', name: '引越し費用', amount: 350000, scheduled_date: '2027年3月', days: 335, icon: '📦', memo: '敷金・礼金・仲介料', type: 'variable' as const },
];

export const loansData = [
  { id: '1', name: '住宅ローン', principal: 35000000, annual_rate: 0.475, term_years: 35, start_date: '2025年4月', icon: '🏠', bank_name: '三井住友銀行' },
  { id: '2', name: '自動車ローン', principal: 3000000, annual_rate: 1.9, term_years: 5, start_date: '2025年10月', icon: '🚗', bank_name: '楽天銀行' },
];

export const actualChartData: ChartData[] = [
  { m: '11月', inc: 365000, exp: 280000 },
  { m: '12月', inc: 520000, exp: 340000 },
  { m: '1月', inc: 380000, exp: 285000 },
  { m: '2月', inc: 355000, exp: 270000 },
  { m: '3月', inc: 420000, exp: 310000 },
  { m: '4月', inc: 195000, exp: 148000 },
];

export const forecastChartData: ChartData[] = [
  { m: '5月', inc: 390000, exp: 295000 },
  { m: '6月', inc: 385000, exp: 290000 },
  { m: '7月', inc: 395000, exp: 300000 },
  { m: '8月', inc: 390000, exp: 595000 },
  { m: '9月', inc: 400000, exp: 285000 },
  { m: '10月', inc: 395000, exp: 290000 },
  { m: '11月', inc: 385000, exp: 285000 },
  { m: '12月', inc: 530000, exp: 350000 },
  { m: '1月', inc: 390000, exp: 290000 },
  { m: '2月', inc: 385000, exp: 285000 },
  { m: '3月', inc: 395000, exp: 295000 },
  { m: '4月', inc: 390000, exp: 290000 },
];
