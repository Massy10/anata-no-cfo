export const radius = {
  card: 12,
  hero: 16,
  badge: 6,
  icon: 8,
  segment: 12,
  segmentInner: 10,
  fab: 28,
  creditCard: 14,
  input: 20,
} as const;

export const fontSize = {
  hero: 40,
  largeTitle: 34,
  cardAmount: 22,
  listAmount: 17,
  detailAmount: 36,
  inputAmount: 48,
  body: 17,
  caption: 13,
  smallCaption: 11,
  tabLabel: 10,
} as const;

export const fontWeight = {
  hero: '600' as const,
  largeTitle: '700' as const,
  cardAmount: '500' as const,
  listAmount: '400' as const,
  body: '400' as const,
  caption: '400' as const,
  smallCaption: '500' as const,
  tabLabel: '500' as const,
};

export const spacing = {
  screenPaddingH: 16,
  screenPaddingBottom: 120,
  cardPadding: 16,
  cardGap: 8,
  sectionMarginBottom: 16,
  rowMinHeight: 44,
  rowIconSize: 30,
  fabSize: 56,
  fabBottom: 96,
} as const;
