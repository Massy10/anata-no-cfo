# あなたのCFO — iOS App Implementation Skill

## Overview
「あなたのCFO」は個人キャッシュフロー管理iOSアプリ。Rork/Expo(React Native) + Supabase + Gemini 3.1 Pro。
このスキルファイルは、設計書・UIデモ・技術仕様に基づいて実装を進めるためのガイドです。

## Reference Documents（同ディレクトリに配置）
1. `IMPLEMENTATION_GUIDE.md` — 技術実装ガイド（Phase別の詳細手順）
2. `DB_SCHEMA.sql` — Supabaseテーブル定義・RLSポリシー・Edge Function仕様
3. `UI_REFERENCE.jsx` — UIデモコード（807行、全画面の実装参照）
4. `DESIGN_TOKENS.md` — デザイントークン・カラー・タイポグラフィ定義
5. `REQUIREMENTS.md` — 要件定義サマリー（v3.0から抽出）

## Tech Stack
- **Frontend**: Rork / Expo (React Native) — TypeScript
- **Navigation**: React Navigation (Tab Navigator + Stack Navigator)
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **AI (Chat)**: Gemini 3.1 Pro via Supabase Edge Function
- **AI (OCR)**: Gemini Flash via Supabase Edge Function
- **FX Rate**: ExchangeRate-API Open Access (https://open.er-api.com/v6/latest/USD)
- **Subscription**: RevenueCat (react-native-purchases)
- **Ads**: AdMob (react-native-google-mobile-ads)
- **Charts**: victory-native or react-native-chart-kit
- **Blur/Glass**: expo-blur
- **Haptics**: expo-haptics
- **Animation**: react-native-reanimated
- **i18n**: i18next
- **Auth**: expo-apple-authentication, expo-auth-session

## App Flow (confirmed)
```
Onboarding(3 steps) → Login(Apple/Google/Guest) → Analysis Tab(default landing)
```

## Tab Structure
| Tab | Content |
|-----|---------|
| 収入 (Income) | List → Detail → New (JPY/USD toggle) |
| 支出 (Expense) | 4 segments: 一覧/定期/カード/予定 |
| 分析 (Analysis) | Hero CF → Sub-cards → 3-tier chart → CFO chat → Forecast teaser |
| 設定 (Settings) | Profile, Pro, CFO config, General, Appearance, Data, Support |

## Implementation Order
1. Project init + Navigation skeleton
2. Supabase setup (tables, RLS, auth)
3. Onboarding + Login screens
4. Income tab (list, detail, new)
5. Expense tab (4 segments, loan simulator)
6. Analysis tab (hero card, charts, progressive disclosure)
7. CFO Chat (Gemini 3.1 Pro integration)
8. OCR input (Gemini Flash)
9. FX rate integration (ExchangeRate-API)
10. RevenueCat + AdMob
11. Design polish (glassmorphism, animations)
12. Legal pages + App Store prep

## Key Design Decisions (from Advisory Board)
- Hero number (Net CF) uses glassmorphism card, 40px/weight 600
- Tab Bar uses SVG icons with filled/outline states + backdrop blur
- FAB is circular (borderRadius = width/2) with box-shadow
- Save action is NavBar right "完了" button (not mid-screen button)
- Quick suggest in CFO chat sends immediately on tap
- Scheduled expenses show months ("4ヶ月後") not days ("128日")
- "定期" segment has combined total card before sub/loan sections
- Onboarding Step 2 says "AIアドバイザーの名前を決めてください"
- Guest login shows "後からアカウント作成できます" below
