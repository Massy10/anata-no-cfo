import type { Colors } from '@/types';

/**
 * Color Role Map — 各色の意味を厳格に定義
 *
 * blue    : ブランド・操作色（リンク、ボタン、アクティブ状態）
 * green   : 収入・ポジティブ（収入額、プラスCF、成功）
 * red     : 支出・ネガティブ（支出額、マイナスCF、警告）
 * orange  : 時間的注意（予定支出、期限、カウントダウン）
 * purple  : Pro / プレミアム機能のみ
 * cyan    : 固定費のアクセント
 * yellow  : 未使用（将来の注意喚起用に予約）
 *
 * t1 : 主要テキスト
 * t2 : 補助テキスト
 * t3 : プレースホルダー・非活性
 * sep: 区切り線
 */

export const LightColors: Colors = {
  bg: '#FFFFFF',
  bg2: '#F2F2F7',
  bg3: '#E5E5EA',
  fill: '#E5E5EA',
  blue: '#007AFF',
  green: '#34C759',
  red: '#FF3B30',
  orange: '#FF9500',
  yellow: '#FFCC00',
  purple: '#AF52DE',
  cyan: '#5AC8FA',
  t1: '#1C1C1E',
  t2: 'rgba(60,60,67,0.6)',
  t3: 'rgba(60,60,67,0.3)',
  sep: 'rgba(60,60,67,0.1)',
  tabBg: 'rgba(249,249,249,0.94)',
  heroGlass: 'rgba(255,255,255,0.85)',
  heroBorder: 'rgba(0,0,0,0.06)',
  heroShadow: 'rgba(0,0,0,0.04)',
  cardShadow: 'rgba(0,0,0,0.04)',
};

export const DarkColors: Colors = {
  bg: '#000000',
  bg2: '#1C1C1E',
  bg3: '#2C2C2E',
  fill: '#3A3A3C',
  blue: '#0A84FF',
  green: '#30D158',
  red: '#FF453A',
  orange: '#FF9F0A',
  yellow: '#FFD60A',
  purple: '#BF5AF2',
  cyan: '#64D2FF',
  t1: '#F2F2F7',
  t2: 'rgba(235,235,245,0.6)',
  t3: 'rgba(235,235,245,0.3)',
  sep: 'rgba(235,235,245,0.08)',
  tabBg: 'rgba(28,28,30,0.94)',
  heroGlass: 'rgba(28,28,30,0.7)',
  heroBorder: 'rgba(255,255,255,0.06)',
  heroShadow: 'rgba(0,0,0,0.2)',
  cardShadow: 'rgba(0,0,0,0.2)',
};
