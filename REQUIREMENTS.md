# あなたのCFO — Requirements Summary (v3.0)

## What is this app?
Personal cash flow management iOS app with AI CFO advisor.
Manages: salary, side income, investments, subscriptions, credit cards, loans, scheduled expenses.
AI (Gemini 3.1 Pro) analyzes data and suggests improvements.

## App Flow
```
Onboarding (3 steps: Welcome → CFO naming + goals → Confirm)
    ↓
Login (Apple[top] → Google → Guest)
    ↓
Analysis Tab (default landing)
    ↓
4 tabs: Income | Expense | Analysis | Settings
```

## 16 Features
| ID | Feature | Key Details |
|----|---------|-------------|
| F-01 | Manual input | JPY/USD toggle. NavBar right "完了". USD auto-converts. |
| F-02 | OCR input | Gemini Flash. Camera/photo picker. |
| F-03 | Expense classification | 3 layers: payment method × tag × fixed/variable |
| F-04 | Subscriptions | In "定期" segment. Shows next payment date. |
| F-05 | Loans | 元利均等返済 calculator. Rate/term sliders. |
| F-06 | Credit cards | 3D visual card. Usage bar. Closing/payment days. |
| F-07 | Scheduled expenses | Month-based badge ("4ヶ月後"). Color-coded. |
| F-08 | Analysis dashboard | Hero CF (glassmorphism) → 3 sub-cards → 3-tier chart → CFO card → forecast teaser |
| F-09 | CFO Chat | Gemini 3.1 Pro. Free=30/mo, Pro=100/mo. Auto-analysis doesn't count. Suggest = instant send. |
| F-10 | Onboarding | Before login (sunk cost). CFO naming. Goal setting. |
| F-11 | Multi-currency | JPY/USD. ExchangeRate-API (free, no key). Daily cache. |
| F-12 | Appearance | Light/Dark/System. Mesh gradient background. |
| F-13 | i18n | ja/en. Auto-detect + manual. |
| F-14 | Widget | iOS home screen summary. Pro only. |
| F-15 | Auth | Apple (top) / Google / Guest. |
| F-16 | Settings | CFO config (name/goals), Pro purchase, general, appearance. |

## Freemium
| Feature | Free | Pro (¥300/mo or ¥3,000/yr) |
|---------|------|---------------------------|
| Manual input | Unlimited | Unlimited |
| OCR | 5/mo | Unlimited |
| CFO Chat | 30/mo | 100/mo |
| 3mo chart | Yes | Yes |
| 6mo chart | Yes | Yes |
| 12mo forecast | 2mo teaser | Full |
| Subs/Loans/Cards | 3/1/1 | Unlimited |
| Ads | Shown | Hidden |
| Currency | JPY only | JPY + USD |

## CFO Chat Rate Limit
- DB column: `users.cfo_chat_count` (INT, default 0)
- DB column: `users.cfo_chat_reset_at` (TIMESTAMPTZ)
- Edge Function checks before Gemini call
- pg_cron resets monthly (1st of month, 00:00 UTC)
- Initial auto-analysis (3 proposals) does NOT count

## FX Rate
- API: https://open.er-api.com/v6/latest/USD (no key, free)
- Edge Function fetches daily → `fx_rates` table
- Fallback: latest cached rate (or 149.50 hardcoded)
- Input screens show realtime JPY preview when USD selected

## Design Highlights
- Glassmorphism: hero card, CFO card, summary cards, Pro card
- Mesh gradient background (blue 4% + green 3%)
- SVG tab icons (filled/outline)
- Tab Bar: backdrop blur
- FAB: circular + shadow
- Charts: gradient bars
- Detail icons: 72px card with glow shadow
- Credit cards: 3-layer decorative circles
- All borderRadius unified: card=12, badge=6, icon=8, hero=16

## Legal
- Privacy: warikankun.com/cfo/privacy
- Terms: warikankun.com/cfo/terms
- Tokushoho: warikankun.com/cfo/tokushoho
