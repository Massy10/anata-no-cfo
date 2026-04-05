# あなたのCFO — Design Tokens

## Color Palette

### Light Mode
```typescript
const LightColors = {
  // Base
  bg: '#FFFFFF',
  bg2: '#F2F2F7',       // Grouped table background
  bg3: '#E5E5EA',
  fill: '#E5E5EA',      // Segmented control background
  
  // Semantic
  blue: '#007AFF',      // Primary action, links
  green: '#34C759',     // Income, positive CF
  red: '#FF3B30',       // Expense, negative CF
  orange: '#FF9500',    // Warnings, loans
  yellow: '#FFCC00',
  purple: '#AF52DE',    // USD badge, brand accent
  cyan: '#32ADE6',      // Fixed cost badge
  
  // Text
  t1: '#000000',        // Primary text
  t2: '#3C3C4399',      // Secondary text (60% opacity)
  t3: '#3C3C434D',      // Tertiary text (30% opacity) — USE SPARINGLY, low contrast
  
  // Structure
  sep: '#C6C6C8',       // Separator lines (0.5px)
  tabBg: 'rgba(249,249,249,0.85)',  // Tab bar (semi-transparent for blur)
  
  // Pro design
  meshBg: 'radial-gradient(ellipse at 20% 0%, rgba(0,122,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(52,199,89,0.03) 0%, transparent 50%)',
  heroGlass: 'rgba(255,255,255,0.7)',
  heroBorder: 'rgba(255,255,255,0.8)',
  heroShadow: '0 2px 20px rgba(0,0,0,0.04)',
  cardShadow: '0 1px 8px rgba(0,0,0,0.03)',
};
```

### Dark Mode
```typescript
const DarkColors = {
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
  t1: '#FFFFFF',
  t2: '#EBEBF5CC',
  t3: '#EBEBF54D',
  sep: '#38383A',
  tabBg: 'rgba(28,28,30,0.85)',
  meshBg: 'radial-gradient(ellipse at 20% 0%, rgba(10,132,255,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(48,209,88,0.04) 0%, transparent 50%)',
  heroGlass: 'rgba(28,28,30,0.6)',
  heroBorder: 'rgba(255,255,255,0.08)',
  heroShadow: '0 2px 20px rgba(0,0,0,0.2)',
  cardShadow: '0 1px 8px rgba(0,0,0,0.15)',
};
```

## Border Radius Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `radius.card` | 12px | Section cards, summary cards, buttons |
| `radius.hero` | 16px | Hero card, Pro purchase card, onboarding button |
| `radius.badge` | 6px | Category badges, plan badges |
| `radius.icon` | 8px | Row icons, setting icons |
| `radius.segment` | 12px outer, 10px inner | Segmented control |
| `radius.fab` | 28px (= width/2) | FAB (circular) |
| `radius.creditCard` | 14px | Credit card visual |
| `radius.input` | 20px | Chat input field |

## Typography
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `hero` | 40px | 600 | Net CF on analysis landing |
| `largeTitleSize` | 34px | 700 | Screen titles (Large Title) |
| `cardAmount` | 22px | 500 | Summary card amounts |
| `listAmount` | 17px | 400 | List row amounts |
| `detailAmount` | 36px | 500 | Detail screen hero amount |
| `inputAmount` | 48px | 200 | New input screen amount |
| `body` | 17px | 400 | Row titles, form labels |
| `caption` | 13px | 400 | Subtitles, secondary info |
| `smallCaption` | 11px | 500 | Card labels, badges |
| `tabLabel` | 10px | 500 | Tab bar labels |

Font family: `-apple-system, 'SF Pro Display', system-ui, sans-serif`

## Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `screen.paddingH` | 16px | Horizontal padding for all screen content |
| `screen.paddingBottom` | 120px | Bottom padding (Tab Bar clearance) |
| `card.padding` | 12-16px | Inside section cards |
| `card.gap` | 6-8px | Between adjacent cards |
| `section.marginBottom` | 16px | Between sections |
| `row.minHeight` | 44px | Touch target (HIG requirement) |
| `row.iconSize` | 30x30px | Row left icon container |
| `fab.size` | 56x56px | Floating action button |
| `fab.bottom` | 96px | FAB distance from bottom |

## Glassmorphism Recipe
```typescript
// Hero card (analysis landing)
{
  backgroundColor: colors.heroGlass,
  backdropFilter: 'blur(12px)',
  borderWidth: 0.5,
  borderColor: colors.heroBorder,
  boxShadow: colors.heroShadow,
  borderRadius: 16,
}

// CFO chat entry card
{
  backgroundColor: colors.heroGlass,
  backdropFilter: 'blur(12px)',
  borderWidth: 0.5,
  borderColor: colors.heroBorder,
  boxShadow: colors.heroShadow,
  borderRadius: 16,
  // + decorative bubble (position: absolute, top: -15, right: -15, 60x60, purple 8%)
}

// Tab Bar
{
  position: 'absolute',
  backgroundColor: colors.tabBg,
  backdropFilter: 'saturate(180%) blur(20px)',
}
```

## Decorative Bubbles Spec
| Screen | Count | Positions & Sizes |
|--------|-------|--------------------|
| Onboarding Welcome | 4 | TL 120px blue 8%, TR 80px purple 6%, BL 60px green 6%, BR 100px blue 5% |
| Login | 2 | TR 100px blue 6%, BL 80px purple 5% |
| Analysis Hero Card | 2 | TR 80px green/red 12%, BL 60px green/red 8% |
| CFO Chat Entry Card | 1 | TR 60px purple 8% |
| Pro Purchase Card | 1 | TR 80px blue 8% |
| Credit Card Visual | 3 | TR 120px white 7%, BL 80px white 4%, TR-mid 40px white 3% |

## Tab Bar Icons (SVG)
All icons are 22x22px. Active = filled, Inactive = outline only.

| Tab | Icon Description |
|-----|-----------------|
| 収入 (Income) | Circle with down arrow (coin incoming) |
| 支出 (Expense) | Rectangle with horizontal line (card) |
| 分析 (Analysis) | 3 vertical bars (chart) |
| 設定 (Settings) | Circle with radiating lines (gear/sun) |

See UI_REFERENCE.jsx `TBIcons` object for exact SVG paths.
