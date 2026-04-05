# あなたのCFO — Implementation Guide

## Phase 1: Project Init (Week 1)

### 1.1 Expo Project Setup
```bash
npx create-expo-app anata-no-cfo --template expo-template-blank-typescript
cd anata-no-cfo
npx expo install expo-router react-native-screens react-native-safe-area-context
npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
```

### 1.2 Core Dependencies
```bash
# Auth
npx expo install expo-apple-authentication expo-auth-session expo-crypto expo-secure-store

# Supabase
npm install @supabase/supabase-js

# UI
npx expo install expo-blur expo-haptics expo-image-picker expo-camera
npm install react-native-reanimated react-native-gesture-handler

# Charts
npm install victory-native react-native-svg

# i18n
npm install i18next react-i18next

# Monetization
npm install react-native-purchases react-native-google-mobile-ads
```

### 1.3 Navigation Structure
```
app/
├── (tabs)/
│   ├── _layout.tsx          # Tab Navigator (4 tabs)
│   ├── income/
│   │   ├── index.tsx         # IncList
│   │   ├── [id].tsx          # IncDetail
│   │   └── new.tsx           # IncNew
│   ├── expense/
│   │   ├── index.tsx         # ExpTab (4 segments)
│   │   ├── [id].tsx          # ExpDetail
│   │   ├── sub/[id].tsx      # SubDetail
│   │   ├── loan/[id].tsx     # LoanDetail
│   │   └── new.tsx           # ExpNew
│   ├── analysis/
│   │   ├── index.tsx         # Ana (landing)
│   │   └── cfo-chat.tsx      # CfoChat
│   └── settings/
│       └── index.tsx         # Stg
├── onboarding.tsx            # Onboarding (3 steps)
├── login.tsx                 # Login
└── _layout.tsx               # Root layout (auth check)
```

### 1.4 Supabase Client
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key) => SecureStore.getItemAsync(key),
      setItem: (key, value) => SecureStore.setItemAsync(key, value),
      removeItem: (key) => SecureStore.deleteItemAsync(key),
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## Phase 2: Core Screens (Week 2-3)

### 2.1 Screen Implementation Order
UI_REFERENCE.jsx の各関数が1:1で画面に対応する:
- `Onboarding` → app/onboarding.tsx
- `Login` → app/login.tsx
- `IncList` → app/(tabs)/income/index.tsx
- `IncDetail` → app/(tabs)/income/[id].tsx
- `IncNew` → app/(tabs)/income/new.tsx
- `ExpTab` → app/(tabs)/expense/index.tsx
- `ExpDetail` → app/(tabs)/expense/[id].tsx
- `SubDetail` → app/(tabs)/expense/sub/[id].tsx
- `LoanDetail` → app/(tabs)/expense/loan/[id].tsx
- `ExpNew` → app/(tabs)/expense/new.tsx
- `Ana` → app/(tabs)/analysis/index.tsx
- `CfoChat` → app/(tabs)/analysis/cfo-chat.tsx
- `Stg` → app/(tabs)/settings/index.tsx

### 2.2 Shared Components
UI_REFERENCE.jsx のプリミティブを共有コンポーネント化:
```
components/
├── ui/
│   ├── LargeTitle.tsx        # LgT
│   ├── NavBar.tsx            # NvB
│   ├── SectionCard.tsx       # Sc
│   ├── TableRow.tsx          # Rw
│   ├── SegmentedControl.tsx  # Sg
│   ├── FAB.tsx               # FAB
│   ├── ChartBars.tsx         # Bars
│   └── Legend.tsx            # Legend
├── cards/
│   ├── HeroCard.tsx          # Glassmorphism hero (Net CF)
│   ├── SummaryCard.tsx       # Sub-cards (income/expense/MoM)
│   ├── CfoEntryCard.tsx      # CFO chat entry point
│   └── CreditCard.tsx        # 3D visual credit card
└── theme/
    ├── colors.ts             # LT_C / DK_C
    ├── tokens.ts             # borderRadius, fontWeight, etc.
    └── useTheme.ts           # Theme hook with system detection
```

---

## Phase 3: AI + Analytics (Week 4)

### 3.1 Gemini 3.1 Pro (CFO Chat)
Edge Function: `supabase/functions/cfo-chat/index.ts`
```typescript
// 1. Check rate limit (DB counter)
// 2. Call Gemini 3.1 Pro API
// 3. Increment counter (skip if is_auto_analysis)
// 4. Return response

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const MODEL = 'gemini-3.1-pro'; // or latest available

// Rate limit check
const { data: user } = await supabase
  .from('users')
  .select('cfo_chat_count, cfo_chat_reset_at, plan')
  .eq('id', userId)
  .single();

const limit = user.plan === 'pro' ? 100 : 30;
if (user.cfo_chat_count >= limit) {
  return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429 });
}
```

### 3.2 Gemini Flash (OCR)
Edge Function: `supabase/functions/ocr/index.ts`
- Receive base64 image
- Call Gemini Flash with prompt: "Extract amount, date, category from this receipt"
- Return structured JSON { amount, date, category, memo }

### 3.3 FX Rate Fetching
Edge Function: `supabase/functions/fetch-fx-rate/index.ts`
- Scheduled via pg_cron (daily at 00:05 UTC)
- GET https://open.er-api.com/v6/latest/USD
- Extract rates.JPY
- Upsert into fx_rates table

### 3.4 CFO Chat Monthly Reset
pg_cron job (monthly at 00:00 UTC on 1st):
```sql
SELECT cron.schedule('reset-cfo-chat', '0 0 1 * *',
  $$UPDATE users SET cfo_chat_count = 0, cfo_chat_reset_at = NOW()$$
);
```

---

## Phase 4: Monetization (Week 5)

### 4.1 RevenueCat Setup
```typescript
// App entry point
import Purchases from 'react-native-purchases';

Purchases.configure({ apiKey: 'appl_YOUR_KEY' });

// Check entitlement
const customerInfo = await Purchases.getCustomerInfo();
const isPro = customerInfo.entitlements.active['pro'] !== undefined;
```

### 4.2 Pro Feature Gating
```typescript
// contexts/subscription.tsx
const useSubscription = () => {
  const [isPro, setIsPro] = useState(false);
  // ... RevenueCat listener
  return { isPro };
};

// Usage in components
if (!isPro && cfoChantCount >= 30) {
  showPaywall();
}
```

### 4.3 AdMob
- Banner: Bottom of income/expense list screens
- Interstitial: After every 5th transaction save (Free users only)
- Hidden when `isPro === true`

---

## Phase 5: Polish (Week 5)

### 5.1 Glassmorphism Pattern
```typescript
import { BlurView } from 'expo-blur';

<BlurView intensity={12} tint="light" style={styles.heroCard}>
  {/* Content */}
</BlurView>
```

### 5.2 Mesh Background
```typescript
// Apply to root layout
<LinearGradient
  colors={['rgba(0,122,255,0.04)', 'transparent', 'rgba(52,199,89,0.03)']}
  locations={[0, 0.5, 1]}
  start={{ x: 0.2, y: 0 }}
  end={{ x: 0.8, y: 1 }}
  style={StyleSheet.absoluteFill}
/>
```

### 5.3 Tab Bar Blur
```typescript
// In Tab Navigator
<Tab.Navigator
  screenOptions={{
    tabBarStyle: { position: 'absolute', backgroundColor: 'transparent' },
    tabBarBackground: () => (
      <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
    ),
  }}
/>
```

---

## Phase 6: Store Prep (Week 6)

### 6.1 Legal Pages
Deploy to warikankun.com:
- `/cfo/privacy` — Privacy Policy
- `/cfo/terms` — Terms of Service  
- `/cfo/tokushoho` — 特定商取引法表記

### 6.2 App Store Metadata
- Title: あなたのCFO - AI家計管理
- Subtitle: 収支分析・改善提案・将来予測
- Keywords: 家計簿,AI,キャッシュフロー,収支管理,サブスク,ローン,副業,投資
- Category: Finance
- Price: Free (with IAP)

### 6.3 Screenshots
5 screens × 3 sizes (5.5"/6.5"/6.7"):
1. Analysis landing (hero CF + chart)
2. CFO Chat conversation
3. Income list with USD item
4. Expense credit card view
5. Onboarding welcome
