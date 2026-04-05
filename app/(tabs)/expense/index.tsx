import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { BlurView } from 'expo-blur';
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
import { useExpenses } from '@/hooks/useExpenses';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useScheduledExpenses } from '@/hooks/useScheduledExpenses';
import { useLoans } from '@/hooks/useLoans';

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

  const { data: expenseData } = useExpenses();
  const { data: creditCardsData } = useCreditCards();
  const { data: subscriptionsData } = useSubscriptions();
  const { data: scheduledExpensesData } = useScheduledExpenses();
  const { data: loansData } = useLoans();

  // Totals
  const totalExpense = useMemo(
    () =>
      expenseData.reduce(
        (sum, e) => sum + toJPY(e.amount, e.currency, e.date),
        0,
      ),
    [expenseData],
  );

  const diff = totalExpense - LAST_MONTH_TOTAL;
  const diffPct = Math.round((diff / LAST_MONTH_TOTAL) * 100);
  const diffUp = diff > 0;

  // Recurring totals
  const subsTotal = useMemo(
    () => subscriptionsData.reduce((sum, s) => sum + s.amount, 0),
    [subscriptionsData],
  );
  const loanMonthlyTotal = useMemo(
    () =>
      loansData.reduce(
        (sum, l) => sum + calcMonthly(l.principal, l.annual_rate, l.term_years),
        0,
      ),
    [loansData],
  );
  const recurringTotal = subsTotal + loanMonthlyTotal;

  // Scheduled total
  const schedTotal = useMemo(
    () => scheduledExpensesData.reduce((sum, s) => sum + s.amount, 0),
    [scheduledExpensesData],
  );

  const hasUsd = expenseData.some((e) => e.currency === 'USD');

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    if (expenseFilter === 'すべて') return expenseData;
    if (expenseFilter === '固定費') return expenseData.filter((e) => e.type === 'fixed');
    return expenseData.filter((e) => e.type === 'variable');
  }, [expenseFilter, expenseData]);

  const showScheduledInVariable = expenseFilter === '変動費';

  const renderList = () => (
    <>
      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexShrink: 0, flexGrow: 0 }}
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
                  backgroundColor: active ? colors.red + '1A' : 'transparent',
                  borderColor: active ? colors.red + '33' : colors.sep,
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: active ? colors.red : colors.t3, fontWeight: active ? '600' : '400' },
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

          let subtitle = `${item.payment_method} · ${item.tag} · ${item.date}`;
          if (isUSD) subtitle += ` · ¥${jpyAmt.toLocaleString()}換算`;

          return (
            <TableRow
              key={item.id}
              icon={item.icon}
              iconBg={isFixed ? colors.cyan + '22' : colors.red + '15'}
              title={item.name}
              subtitle={subtitle}
              badge={isUSD ? 'USD' : isFixed ? '固定' : undefined}
              badgeColor={isUSD ? colors.purple : undefined}
              right={`${sym}${item.amount.toLocaleString()}`}
              rightSub={isUSD ? `@${rate}` : undefined}
              last={idx === filteredExpenses.length - 1}
              onPress={() => router.push(`/expense/${item.id}`)}
            />
          );
        })}
      </SectionCard>

      {showScheduledInVariable && scheduledExpensesData.length > 0 && (
        <SectionCard header="予定一時金">
          {scheduledExpensesData.map((item, idx) => {
            const months = Math.round((item.days ?? 0) / 30);
            const badgeText = months <= 1 ? '今月中' : months < 12 ? `${months}ヶ月後` : `${Math.round(months / 12)}年後`;
            const badgeColor = months < 5 ? colors.orange : colors.cyan;
            return (
              <TableRow
                key={item.id}
                icon={item.icon}
                iconBg={colors.orange + '22'}
                title={item.name}
                subtitle={`${item.scheduled_date} · ${item.memo}`}
                badge={badgeText}
                badgeColor={badgeColor}
                right={`¥${item.amount.toLocaleString()}`}
                rightColor={colors.orange}
                last={idx === scheduledExpensesData.length - 1}
              />
            );
          })}
        </SectionCard>
      )}
    </>
  );

  const renderRecurring = () => (
    <>
      {/* Combined total card */}
      <View style={[styles.recurringHero, { backgroundColor: colors.heroGlass, borderColor: colors.heroBorder }]}>
        <BlurView intensity={8} style={StyleSheet.absoluteFill} />
        <Text style={[styles.recurringLabel, { color: colors.cyan }]}>
          定期支出 合計
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4 }}>
          <Text style={{ fontSize: 24, fontWeight: '500', color: colors.t1 }}>
            ¥{recurringTotal.toLocaleString()}
          </Text>
          <Text style={{ fontSize: 14, color: colors.t2, fontWeight: '400' }}>/月</Text>
        </View>
        <View style={styles.recurringBreakdown}>
          <Text style={[styles.breakdownText, { color: colors.purple }]}>
            サブスク ¥{subsTotal.toLocaleString()}
          </Text>
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
            iconBg={colors.purple + '22'}
            title={s.name}
            subtitle={`${s.card} · ${s.cycle}`}
            right={`¥${s.amount.toLocaleString()}`}
            rightSub={`次回 ${s.next_payment_date}`}
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
          const monthly = calcMonthly(l.principal, l.annual_rate, l.term_years);
          const total = calcTotal(l.principal, l.annual_rate, l.term_years);
          const totalMan = Math.round(total / 10000);
          return (
            <TableRow
              key={l.id}
              icon={l.icon}
              iconBg={colors.orange + '22'}
              title={l.name}
              subtitle={`${l.bank_name} · ${l.annual_rate}% · ${l.term_years}年`}
              badge={`金利${l.annual_rate}%`}
              badgeColor={colors.orange}
              right={`¥${monthly.toLocaleString()}/月`}
              rightColor={colors.orange}
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
      {/* Add card button */}
      <TouchableOpacity
        style={[styles.addCardBtn, { backgroundColor: colors.bg2, borderColor: colors.sep }]}
        onPress={() => router.push('/expense/card/new')}
        activeOpacity={0.7}
      >
        <Text style={[styles.addCardText, { color: colors.blue }]}>＋ カードを追加</Text>
      </TouchableOpacity>
      {creditCardsData.map((card) => {
        const usage = card.balance / card.credit_limit;
        const usagePct = (usage * 100).toFixed(0);
        const barColor = usage > 0.7 ? colors.red : colors.green;

        return (
          <View key={card.id} style={styles.cardContainer}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.push(`/expense/card/${card.id}`)}>
              <CreditCardVisual card={card} />
            </TouchableOpacity>
            {/* Usage bar */}
            <View style={styles.usageBarOuter}>
              <View style={[styles.usageTextRow, { marginBottom: 4 }]}>
                <Text style={[styles.usagePct, { color: colors.t2 }]}>
                  利用率 {usagePct}%
                </Text>
                <Text style={[styles.usageLimit, { color: colors.t2 }]}>
                  限度額 ¥{card.credit_limit.toLocaleString()}
                </Text>
              </View>
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
          { backgroundColor: colors.bg2 },
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
          const months = Math.round((item.days ?? 0) / 30);
          const badgeText = months <= 1 ? '今月中' : months < 12 ? `${months}ヶ月後` : `${Math.round(months / 12)}年後`;
          const badgeColor = months < 5 ? colors.orange : colors.cyan;
          return (
            <TableRow
              key={item.id}
              icon={item.icon}
              iconBg={colors.orange + '22'}
              title={item.name}
              subtitle={`${item.scheduled_date} · ${item.memo}`}
              badge={badgeText}
              badgeColor={badgeColor}
              right={`¥${item.amount.toLocaleString()}`}
              rightColor={colors.orange}
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
            styles.cardShadow,
            {
              backgroundColor: colors.heroGlass,
              borderColor: colors.heroBorder,
              borderWidth: StyleSheet.hairlineWidth,
            },
          ]}
        >
          <BlurView intensity={8} style={StyleSheet.absoluteFill} />
          <Text style={[styles.summaryLabel, { color: colors.red }]}>
            今月の支出{hasUsd ? ' (円換算)' : ''}
          </Text>
          <Text style={[styles.summaryAmount, { color: colors.t1 }]}>
            ¥{totalExpense.toLocaleString()}
          </Text>
        </View>

        <View style={{ width: 6 }} />

        <View
          style={[
            styles.momCard,
            {
              backgroundColor: diffUp ? colors.red + '10' : colors.green + '10',
              borderColor: diffUp ? colors.red + '22' : colors.green + '22',
              borderWidth: StyleSheet.hairlineWidth,
            },
          ]}
        >
          <Text
            style={[
              styles.momLabel,
              { color: diffUp ? colors.red : colors.green },
            ]}
          >
            前月比
          </Text>
          <Text
            style={[
              styles.momDiff,
              { color: colors.t1 },
            ]}
          >
            {diffUp ? '+' : ''}¥{diff.toLocaleString()}
          </Text>
          <Text
            style={[
              styles.momPct,
              { color: diffUp ? colors.red : colors.green },
            ]}
          >
            {diffUp ? '↑' : '↓'}{Math.abs(diffPct)}%
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
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 2,
  },
  momCard: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
  },
  momLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  momDiff: {
    fontSize: 18,
    fontWeight: '300',
    marginTop: 2,
  },
  momPct: {
    fontSize: 11,
    marginTop: 1,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontSize: 13,
  },
  // Recurring
  recurringHero: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  recurringLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  recurringBreakdown: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  breakdownText: {
    fontSize: 12,
  },
  // Cards
  cardContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  usageBarOuter: {
    paddingTop: 8,
    paddingHorizontal: 4,
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
  },
  usagePct: {
    fontSize: 13,
  },
  usageLimit: {
    fontSize: 13,
  },
  addCardBtn: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 0.5,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addCardText: {
    fontSize: 15,
    fontWeight: '500',
  },
  // Scheduled
  schedHero: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  schedLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  schedAmount: {
    fontSize: 20,
    fontWeight: '300',
    marginTop: 2,
  },
});
