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
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { FAB } from '@/components/ui/FAB';
import { CreditCardVisual } from '@/components/cards/CreditCardVisual';
import { toJPY, getRate } from '@/lib/fx';
import { calcMonthly, calcTotal } from '@/lib/loan';
import {
  expenseData,
  subscriptionsData,
  creditCardsData,
  scheduledExpensesData,
  loansData,
} from '@/constants/mockData';

const SEGMENTS: [string, string][] = [
  ['list', '一覧'],
  ['recurring', '定期'],
  ['cards', 'カード'],
  ['sched', '予定'],
];

const EXPENSE_FILTERS = ['すべて', '固定費', '変動費'] as const;
const LAST_MONTH_TOTAL = 310000;

export default function ExpenseTabScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [segment, setSegment] = useState('list');
  const [expenseFilter, setExpenseFilter] = useState<string>('すべて');

  // Totals
  const totalExpense = useMemo(
    () =>
      expenseData.reduce(
        (sum, e) => sum + toJPY(e.amount, e.currency, e.date),
        0,
      ),
    [],
  );

  const diff = totalExpense - LAST_MONTH_TOTAL;
  const diffPct = ((diff / LAST_MONTH_TOTAL) * 100).toFixed(1);
  const diffUp = diff >= 0;

  // Recurring totals
  const subsTotal = useMemo(
    () => subscriptionsData.reduce((sum, s) => sum + s.amount, 0),
    [],
  );
  const loanMonthlyTotal = useMemo(
    () =>
      loansData.reduce(
        (sum, l) => sum + calcMonthly(l.principal, l.annualRate, l.termYears),
        0,
      ),
    [],
  );
  const recurringTotal = subsTotal + loanMonthlyTotal;

  // Scheduled total
  const schedTotal = useMemo(
    () => scheduledExpensesData.reduce((sum, s) => sum + s.amount, 0),
    [],
  );

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    if (expenseFilter === 'すべて') return expenseData;
    if (expenseFilter === '固定費') return expenseData.filter((e) => e.type === 'fixed');
    return expenseData.filter((e) => e.type === 'variable');
  }, [expenseFilter]);

  const renderList = () => (
    <>
      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {EXPENSE_FILTERS.map((f) => {
          const active = f === expenseFilter;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setExpenseFilter(f)}
              style={[
                styles.pill,
                {
                  backgroundColor: active ? colors.red + '21' : 'transparent',
                  borderColor: active ? colors.red : colors.sep,
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: active ? colors.red : colors.t2 },
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <SectionCard>
        {filteredExpenses.map((item, idx) => {
          const isUSD = item.currency === 'USD';
          const rate = getRate(item.date);
          const jpyAmt = isUSD
            ? toJPY(item.amount, item.currency, item.date)
            : item.amount;
          const sym = isUSD ? '$' : '¥';
          const isFixed = item.type === 'fixed';

          let subtitle = `${item.method} · ${item.tag} · ${item.date}`;
          if (isUSD) subtitle += ` · ¥${jpyAmt.toLocaleString()}換算`;

          return (
            <TableRow
              key={item.id}
              icon={item.icon}
              iconBg={isFixed ? colors.cyan + '21' : colors.red + '14'}
              title={item.name}
              subtitle={subtitle}
              badge={isUSD ? 'USD' : isFixed ? '固定' : undefined}
              badgeColor={isUSD ? colors.purple : colors.cyan}
              right={`${sym}${item.amount.toLocaleString()}`}
              rightSub={isUSD ? `@${rate} JPY/USD` : undefined}
              last={idx === filteredExpenses.length - 1}
              onPress={() => router.push(`/expense/${item.id}`)}
            />
          );
        })}
      </SectionCard>
    </>
  );

  const renderRecurring = () => (
    <>
      {/* Combined total card */}
      <View style={[styles.recurringHero, { backgroundColor: colors.heroGlass, borderColor: colors.heroBorder }]}>
        <Text style={[styles.recurringLabel, { color: colors.cyan }]}>
          定期支出 合計
        </Text>
        <Text style={[styles.recurringAmount, { color: colors.t1 }]}>
          ¥{recurringTotal.toLocaleString()}/月
        </Text>
        <View style={styles.recurringBreakdown}>
          <Text style={[styles.breakdownText, { color: colors.purple }]}>
            サブスク ¥{subsTotal.toLocaleString()}
          </Text>
          <Text style={[styles.breakdownSep, { color: colors.t3 }]}> + </Text>
          <Text style={[styles.breakdownText, { color: colors.orange }]}>
            ローン ¥{loanMonthlyTotal.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Subscriptions */}
      <SectionCard
        header={`サブスク ${subscriptionsData.length}件 · ¥${subsTotal.toLocaleString()}/月`}
      >
        {subscriptionsData.map((s, idx) => (
          <TableRow
            key={s.id}
            icon={s.icon}
            iconBg={colors.purple + '21'}
            title={s.name}
            right={`¥${s.amount.toLocaleString()}`}
            rightSub={`次回 ${s.nextDate}`}
            last={idx === subscriptionsData.length - 1}
            onPress={() => router.push(`/expense/sub/${s.id}`)}
          />
        ))}
      </SectionCard>

      {/* Loans */}
      <SectionCard
        header={`ローン ${loansData.length}件 · ¥${loanMonthlyTotal.toLocaleString()}/月`}
      >
        {loansData.map((l, idx) => {
          const monthly = calcMonthly(l.principal, l.annualRate, l.termYears);
          const total = calcTotal(l.principal, l.annualRate, l.termYears);
          const totalMan = Math.round(total / 10000);
          return (
            <TableRow
              key={l.id}
              icon={l.icon}
              iconBg={colors.orange + '21'}
              title={l.name}
              badge={`金利${l.annualRate}%`}
              badgeColor={colors.orange}
              right={`¥${monthly.toLocaleString()}/月`}
              rightSub={`総額 ¥${totalMan.toLocaleString()}万`}
              last={idx === loansData.length - 1}
              onPress={() => router.push(`/expense/loan/${l.id}`)}
            />
          );
        })}
      </SectionCard>
    </>
  );

  const renderCards = () => (
    <>
      {creditCardsData.map((card) => {
        const usage = card.balance / card.credit_limit;
        const usagePct = (usage * 100).toFixed(0);
        const barColor = usage > 0.7 ? colors.red : colors.green;

        return (
          <View key={card.id} style={styles.cardContainer}>
            <CreditCardVisual card={card} />
            {/* Usage bar */}
            <View style={styles.usageBarOuter}>
              <View
                style={[styles.usageBarBg, { backgroundColor: colors.fill }]}
              >
                <View
                  style={[
                    styles.usageBarInner,
                    {
                      backgroundColor: barColor,
                      width: `${Math.min(usage * 100, 100)}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.usageTextRow}>
                <Text style={[styles.usagePct, { color: colors.t2 }]}>
                  {usagePct}% 使用
                </Text>
                <Text style={[styles.usageLimit, { color: colors.t3 }]}>
                  限度額 ¥{card.credit_limit.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </>
  );

  const renderScheduled = () => (
    <>
      {/* Summary card */}
      <View
        style={[
          styles.schedHero,
          { backgroundColor: colors.heroGlass, borderColor: colors.heroBorder },
        ]}
      >
        <Text style={[styles.schedLabel, { color: colors.orange }]}>
          予定支出合計
        </Text>
        <Text style={[styles.schedAmount, { color: colors.t1 }]}>
          ¥{schedTotal.toLocaleString()}
        </Text>
      </View>

      <SectionCard>
        {scheduledExpensesData.map((item, idx) => {
          const badgeColor = item.monthsAway < 5 ? colors.orange : colors.cyan;
          return (
            <TableRow
              key={item.id}
              icon={item.icon}
              iconBg={colors.orange + '14'}
              title={item.name}
              subtitle={item.dueDate}
              badge={`${item.monthsAway}ヶ月後`}
              badgeColor={badgeColor}
              right={`¥${item.amount.toLocaleString()}`}
              last={idx === scheduledExpensesData.length - 1}
            />
          );
        })}
      </SectionCard>
    </>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <LargeTitle
        title="支出"
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
          <Text style={[styles.summaryLabel, { color: colors.red }]}>
            今月の支出
          </Text>
          <Text style={[styles.summaryAmount, { color: colors.t1 }]}>
            ¥{totalExpense.toLocaleString()}
          </Text>
        </View>

        <View style={{ width: spacing.cardGap }} />

        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: diffUp ? colors.red + '14' : colors.green + '14',
              borderColor: diffUp ? colors.red + '33' : colors.green + '33',
              borderWidth: 1,
            },
          ]}
        >
          <Text
            style={[
              styles.summaryLabel,
              { color: diffUp ? colors.red : colors.green },
            ]}
          >
            前月比
          </Text>
          <Text
            style={[
              styles.summaryDiff,
              { color: diffUp ? colors.red : colors.green },
            ]}
          >
            {diffUp ? '↑' : '↓'} ¥{Math.abs(diff).toLocaleString()}
          </Text>
          <Text
            style={[
              styles.summaryPct,
              { color: diffUp ? colors.red : colors.green },
            ]}
          >
            {diffUp ? '+' : ''}{diffPct}%
          </Text>
        </View>
      </View>

      <SegmentedControl options={SEGMENTS} active={segment} onChange={setSegment} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.screenPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        {segment === 'list' && renderList()}
        {segment === 'recurring' && renderRecurring()}
        {segment === 'cards' && renderCards()}
        {segment === 'sched' && renderScheduled()}
      </ScrollView>

      <FAB color={colors.red} onPress={() => router.push('/expense/new')} />
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
    fontSize: 20,
    fontWeight: '500',
  },
  summaryDiff: {
    fontSize: 17,
    fontWeight: '500',
  },
  summaryPct: {
    fontSize: fontSize.caption,
    marginTop: 2,
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
  // Recurring
  recurringHero: {
    marginHorizontal: spacing.screenPaddingH,
    marginBottom: spacing.sectionMarginBottom,
    borderRadius: radius.hero,
    borderWidth: 1,
    padding: spacing.cardPadding,
  },
  recurringLabel: {
    fontSize: fontSize.smallCaption,
    fontWeight: '500',
    marginBottom: 4,
  },
  recurringAmount: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 6,
  },
  recurringBreakdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownText: {
    fontSize: fontSize.caption,
    fontWeight: '500',
  },
  breakdownSep: {
    fontSize: fontSize.caption,
  },
  // Cards
  cardContainer: {
    marginHorizontal: spacing.screenPaddingH,
    marginBottom: spacing.sectionMarginBottom,
  },
  usageBarOuter: {
    marginTop: 10,
  },
  usageBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  usageBarInner: {
    height: 6,
    borderRadius: 3,
  },
  usageTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  usagePct: {
    fontSize: fontSize.caption,
  },
  usageLimit: {
    fontSize: fontSize.caption,
  },
  // Scheduled
  schedHero: {
    marginHorizontal: spacing.screenPaddingH,
    marginBottom: spacing.sectionMarginBottom,
    borderRadius: radius.hero,
    borderWidth: 1,
    padding: spacing.cardPadding,
  },
  schedLabel: {
    fontSize: fontSize.smallCaption,
    fontWeight: '500',
    marginBottom: 4,
  },
  schedAmount: {
    fontSize: 20,
    fontWeight: '500',
  },
});
