import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { spacing } from '@/theme/tokens';
import { LargeTitle } from '@/components/ui/LargeTitle';
import { SectionCard } from '@/components/ui/SectionCard';
import { TableRow } from '@/components/ui/TableRow';
import { FAB } from '@/components/ui/FAB';
import { toJPY, getRate } from '@/lib/fx';
import { useIncome } from '@/hooks/useIncome';
import { useExpenses } from '@/hooks/useExpenses';

const FILTER_KEYS: [string, string][] = [
  ['all', 'すべて'],
  ['給与', '給与'],
  ['副業', '副業'],
  ['投資', '投資'],
  ['その他', 'その他'],
];

export default function IncomeListScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const { data: incomeData, isLoading } = useIncome();
  const { data: expenseData } = useExpenses();

  const hasUSD = incomeData.some((i) => i.currency === 'USD');

  const totalIncome = useMemo(
    () => incomeData.reduce((sum, i) => sum + toJPY(i.amount, i.currency, i.date), 0),
    [incomeData],
  );
  const totalExpense = useMemo(
    () => expenseData.reduce((sum, e) => sum + toJPY(e.amount, e.currency, e.date), 0),
    [expenseData],
  );
  const net = totalIncome - totalExpense;

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return incomeData;
    return incomeData.filter((i) => i.tag === activeFilter);
  }, [activeFilter, incomeData]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <LargeTitle
        title="収入"
        subtitle="2026年4月"
        nav={{ onPrev: () => {}, onNext: () => {} }}
      />

      {/* Summary — 2カード横並び、BlurView廃止 */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: colors.bg2 }]}>
          <Text style={[styles.summaryLabel, { color: colors.green }]}>
            {hasUSD ? '収入合計 (円換算)' : '収入合計'}
          </Text>
          <Text style={[styles.summaryAmount, { color: colors.t1 }]}>
            ¥{totalIncome.toLocaleString()}
          </Text>
        </View>
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: net >= 0 ? colors.green + '08' : colors.red + '08',
              borderWidth: 1,
              borderColor: net >= 0 ? colors.green + '18' : colors.red + '18',
            },
          ]}
        >
          <Text style={[styles.summaryLabel, { color: net >= 0 ? colors.green : colors.red }]}>
            純CF
          </Text>
          <Text style={[styles.summaryAmount, { color: colors.t1 }]}>
            {net >= 0 ? '+' : ''}¥{net.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexShrink: 0, flexGrow: 0 }}
        contentContainerStyle={styles.filterRow}
      >
        {FILTER_KEYS.map(([k, lb]) => {
          const active = k === activeFilter;
          return (
            <TouchableOpacity
              key={k}
              onPress={() => setActiveFilter(k)}
              style={[
                styles.pill,
                {
                  backgroundColor: active ? colors.green + '18' : 'transparent',
                  borderColor: active ? colors.green + '40' : colors.sep,
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  {
                    color: active ? colors.green : colors.t3,
                    fontWeight: active ? '600' : '400',
                  },
                ]}
              >
                {lb}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.screenPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.t2 }]}>
              {activeFilter === 'all' ? '収入データがありません' : `「${activeFilter}」の収入はありません`}
            </Text>
            <Text style={[styles.emptyHint, { color: colors.t3 }]}>
              右下の＋ボタンで追加できます
            </Text>
          </View>
        ) : (
          <SectionCard>
            {filtered.map((item, idx) => {
              const isUSD = item.currency === 'USD';
              const jpyAmt = isUSD ? toJPY(item.amount, item.currency, item.date) : item.amount;
              const rate = getRate(item.date);
              const sym = item.currency === 'USD' ? '$' : '¥';

              let subtitle = `${item.payment_method} · ${item.date}`;
              if (isUSD) subtitle += ` · ¥${jpyAmt.toLocaleString()}換算`;

              return (
                <TableRow
                  key={item.id}
                  icon={item.icon}
                  iconBg={colors.green + '14'}
                  title={item.name}
                  subtitle={subtitle}
                  badge={isUSD ? 'USD' : undefined}
                  badgeColor={isUSD ? colors.orange : undefined}
                  right={`+${sym}${item.amount.toLocaleString()}`}
                  rightColor={colors.green}
                  rightSub={isUSD ? `@${rate} JPY/USD` : undefined}
                  last={idx === filtered.length - 1}
                  onPress={() => router.push(`/income/${item.id}`)}
                />
              );
            })}
          </SectionCard>
        )}
      </ScrollView>

      <FAB color={colors.green} onPress={() => router.push('/income/new')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 3,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 6,
    alignItems: 'center',
    flexDirection: 'row',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  pillText: { fontSize: 13 },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: { fontSize: 16, fontWeight: '500' },
  emptyHint: { fontSize: 13, marginTop: 6 },
});
