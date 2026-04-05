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
import { radius, fontSize, spacing } from '@/theme/tokens';
import { LargeTitle } from '@/components/ui/LargeTitle';
import { SectionCard } from '@/components/ui/SectionCard';
import { TableRow } from '@/components/ui/TableRow';
import { FAB } from '@/components/ui/FAB';
import { toJPY, getRate, formatCurrency, DEFAULT_RATE } from '@/lib/fx';
import { incomeData, expenseData } from '@/constants/mockData';

const FILTERS = ['すべて', '給与', '副業', '投資', 'その他'] as const;

export default function IncomeListScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>('すべて');

  const hasUSD = incomeData.some((i) => i.currency === 'USD');

  const totalIncome = useMemo(
    () => incomeData.reduce((sum, i) => sum + toJPY(i.amount, i.currency, i.date), 0),
    [],
  );
  const totalExpense = useMemo(
    () => expenseData.reduce((sum, e) => sum + toJPY(e.amount, e.currency, e.date), 0),
    [],
  );
  const net = totalIncome - totalExpense;

  const filtered = useMemo(() => {
    if (activeFilter === 'すべて') return incomeData;
    return incomeData.filter((i) => i.tag === activeFilter);
  }, [activeFilter]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <LargeTitle
        title="収入"
        subtitle="2026年4月"
        nav={{ onPrev: () => {}, onNext: () => {} }}
      />

      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.heroGlass,
              borderColor: colors.heroBorder,
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[styles.summaryLabel, { color: colors.green }]}>
            {hasUSD ? '収入合計 (円換算)' : '収入合計'}
          </Text>
          <Text style={[styles.summaryAmount, { color: colors.t1 }]}>
            ¥{totalIncome.toLocaleString()}
          </Text>
        </View>

        <View style={{ width: spacing.cardGap }} />

        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: net >= 0 ? colors.green + '14' : colors.red + '14',
              borderColor: net >= 0 ? colors.green + '33' : colors.red + '33',
              borderWidth: 1,
            },
          ]}
        >
          <Text
            style={[
              styles.summaryLabel,
              { color: net >= 0 ? colors.green : colors.red },
            ]}
          >
            純CF
          </Text>
          <Text
            style={[
              styles.summaryAmount,
              { color: net >= 0 ? colors.green : colors.red },
            ]}
          >
            {net >= 0 ? '+' : ''}¥{net.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => {
          const active = f === activeFilter;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[
                styles.pill,
                {
                  backgroundColor: active ? colors.green + '21' : 'transparent',
                  borderColor: active ? colors.green : colors.sep,
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: active ? colors.green : colors.t2 },
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.screenPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        <SectionCard>
          {filtered.map((item, idx) => {
            const isUSD = item.currency === 'USD';
            const jpyAmt = isUSD ? toJPY(item.amount, item.currency, item.date) : item.amount;
            const rate = getRate(item.date);
            const sym = item.currency === 'USD' ? '$' : '¥';

            let subtitle = `${item.method} · ${item.date}`;
            if (isUSD) subtitle += ` · ¥${jpyAmt.toLocaleString()}換算`;

            return (
              <TableRow
                key={item.id}
                icon={item.icon}
                iconBg={colors.green + '21'}
                title={item.name}
                subtitle={subtitle}
                badge={isUSD ? 'USD' : item.tag}
                badgeColor={isUSD ? colors.purple : colors.green}
                right={`+${sym}${item.amount.toLocaleString()}`}
                rightColor={colors.green}
                rightSub={isUSD ? `@${rate} JPY/USD` : undefined}
                last={idx === filtered.length - 1}
                onPress={() => router.push(`/income/${item.id}`)}
              />
            );
          })}
        </SectionCard>
      </ScrollView>

      <FAB color={colors.green} onPress={() => router.push('/income/new')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPaddingH,
    marginBottom: spacing.sectionMarginBottom,
  },
  summaryCard: {
    flex: 1,
    borderRadius: radius.hero,
    padding: spacing.cardPadding,
  },
  summaryLabel: {
    fontSize: fontSize.smallCaption,
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: fontSize.cardAmount,
    fontWeight: '500',
  },
  filterRow: {
    paddingHorizontal: spacing.screenPaddingH,
    paddingBottom: 12,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 32,
    justifyContent: 'center',
  },
  pillText: {
    fontSize: fontSize.caption,
    fontWeight: '500',
  },
});
