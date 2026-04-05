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
    () => expenseData.reduce((sum, e) => sum + toJPY(e.amount, e.currency, e.date), 0),
    [expenseData],
  );

  const diff = totalExpense - LAST_MONTH_TOTAL;
  const diffPct = LAST_MONTH_TOTAL > 0 ? Math.round((diff / LAST_MONTH_TOTAL) * 100) : 0;
  const diffUp = diff > 0;

  const subsTotal = useMemo(
    () => subscriptionsData.reduce((sum, s) => sum + s.amount, 0),
    [subscriptionsData],
  );
  const loanMonthlyTotal = useMemo(
    () => loansData.reduce((sum, l) => sum + calcMonthly(l.principal, l.annual_rate, l.term_years), 0),
    [loansData],
  );
  const recurringTotal = subsTotal + loanMonthlyTotal;

  const schedTotal = useMemo(
    () => scheduledExpensesData.reduce((sum, s) => sum + s.amount, 0),
    [scheduledExpensesData],
  );

  const hasUsd = expenseData.some((e) => e.currency === 'USD');

  const filteredExpenses = useMemo(() => {
    if (expenseFilter === 'すべて') return expenseData;
    if (expenseFilter === '固定費') return expenseData.filter((e) => e.type === 'fixed');
    return expenseData.filter((e) => e.type === 'variable');
  }, [expenseFilter, expenseData]);

  const showScheduledInVariable = expenseFilter === '変動費';

  const renderEmpty = (message: string) => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: colors.t2 }]}>{message}</Text>
    </View>
  );

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
                  backgroundColor: active ? colors.red + '14' : 'transparent',
                  borderColor: active ? colors.red + '30' : colors.sep,
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

      {filteredExpenses.length === 0 ? (
        renderEmpty(expenseFilter === 'すべて' ? '支出データがありません' : `${expenseFilter}のデータがありません`)
      ) : (
        <SectionCard>
          {filteredExpenses.map((item, idx) => {
            const isUSD = item.currency === 'USD';
            const rate = getRate(item.date);
            const jpyAmt = isUSD ? toJPY(item.amount, item.currency, item.date) : item.amount;
            const sym = isUSD ? '$' : '¥';
            const isFixed = item.type === 'fixed';

            let subtitle = `${item.payment_method} · ${item.tag} · ${item.date}`;
            if (isUSD) subtitle += ` · ¥${jpyAmt.toLocaleString()}換算`;

            return (
              <TableRow
                key={item.id}
                icon={item.icon}
                iconBg={isFixed ? colors.cyan + '18' : colors.red + '10'}
                title={item.name}
                subtitle={subtitle}
                badge={isUSD ? 'USD' : isFixed ? '固定' : undefined}
                badgeColor={isUSD ? colors.orange : colors.cyan}
                right={`${sym}${item.amount.toLocaleString()}`}
                rightSub={isUSD ? `@${rate}` : undefined}
                last={idx === filteredExpenses.length - 1}
                onPress={() => router.push(`/expense/${item.id}`)}
              />
            );
          })}
        </SectionCard>
      )}

      {showScheduledInVariable && scheduledExpensesData.length > 0 && (
        <SectionCard header="予定一時金">
          {scheduledExpensesData.map((item, idx) => {
            const months = Math.round((item.days ?? 0) / 30);
            const badgeText = months <= 1 ? '今月中' : months < 12 ? `${months}ヶ月後` : `${Math.round(months / 12)}年後`;
            return (
              <TableRow
                key={item.id}
                icon={item.icon}
                iconBg={colors.orange + '18'}
                title={item.name}
                subtitle={`${item.scheduled_date} · ${item.memo}`}
                badge={badgeText}
                badgeColor={colors.orange}
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
      {/* Total */}
      <View style={[styles.recurringHero, { backgroundColor: colors.bg2 }]}>
        <Text style={[styles.recurringLabel, { color: colors.t2 }]}>定期支出 合計</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 3 }}>
          <Text style={{ fontSize: 24, fontWeight: '500', color: colors.t1 }}>
            ¥{recurringTotal.toLocaleString()}
          </Text>
          <Text style={{ fontSize: 14, color: colors.t3, marginLeft: 2 }}>/月</Text>
        </View>
      </View>

      {/* Subscriptions */}
      {subscriptionsData.length === 0 ? (
        renderEmpty('サブスクリプションがありません')
      ) : (
        <SectionCard header={`サブスク ${subscriptionsData.length}件`}>
          {subscriptionsData.map((s, idx) => (
            <TableRow
              key={s.id}
              icon={s.icon}
              iconBg={colors.blue + '14'}
              title={s.name}
              subtitle={`${s.card} · ${s.cycle}`}
              right={`¥${s.amount.toLocaleString()}`}
              rightSub={`次回 ${s.next_payment_date}`}
              last={idx === subscriptionsData.length - 1}
              onPress={() => router.push(`/expense/sub/${s.id}`)}
            />
          ))}
        </SectionCard>
      )}

      {/* Loans */}
      {loansData.length > 0 && (
        <SectionCard header={`ローン ${loansData.length}件`}>
          {loansData.map((l, idx) => {
            const monthly = calcMonthly(l.principal, l.annual_rate, l.term_years);
            const total = calcTotal(l.principal, l.annual_rate, l.term_years);
            const totalMan = Math.round(total / 10000);
            return (
              <TableRow
                key={l.id}
                icon={l.icon}
                iconBg={colors.orange + '18'}
                title={l.name}
                subtitle={`${l.bank_name} · ${l.annual_rate}% · ${l.term_years}年`}
                right={`¥${monthly.toLocaleString()}/月`}
                rightSub={`総額 ¥${totalMan.toLocaleString()}万`}
                last={idx === loansData.length - 1}
                onPress={() => router.push(`/expense/loan/${l.id}`)}
              />
            );
          })}
        </SectionCard>
      )}
    </>
  );

  const renderCards = () => (
    <>
      <TouchableOpacity
        style={[styles.addCardBtn, { borderColor: colors.sep }]}
        onPress={() => router.push('/expense/card/new')}
        activeOpacity={0.7}
      >
        <Text style={[styles.addCardText, { color: colors.blue }]}>＋ カードを追加</Text>
      </TouchableOpacity>

      {creditCardsData.length === 0 ? (
        renderEmpty('登録されたカードがありません')
      ) : (
        creditCardsData.map((card) => {
          const usage = card.credit_limit > 0 ? card.balance / card.credit_limit : 0;
          const usagePct = (usage * 100).toFixed(0);
          const barColor = usage > 0.7 ? colors.red : colors.green;

          return (
            <View key={card.id} style={styles.cardContainer}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => router.push(`/expense/card/${card.id}`)}>
                <CreditCardVisual card={card} />
              </TouchableOpacity>
              <View style={styles.usageBarOuter}>
                <View style={styles.usageTextRow}>
                  <Text style={[styles.usagePct, { color: colors.t2 }]}>利用率 {usagePct}%</Text>
                  <Text style={[styles.usageLimit, { color: colors.t3 }]}>限度額 ¥{card.credit_limit.toLocaleString()}</Text>
                </View>
                <View style={[styles.usageBarBg, { backgroundColor: colors.fill }]}>
                  <View style={[styles.usageBarInner, { backgroundColor: barColor, width: `${Math.min(usage * 100, 100)}%` }]} />
                </View>
              </View>
            </View>
          );
        })
      )}
    </>
  );

  const renderScheduled = () => (
    <>
      {scheduledExpensesData.length === 0 ? (
        renderEmpty('予定支出がありません')
      ) : (
        <>
          <View style={[styles.schedHero, { backgroundColor: colors.bg2 }]}>
            <Text style={[styles.schedLabel, { color: colors.orange }]}>予定支出合計</Text>
            <Text style={[styles.schedAmount, { color: colors.t1 }]}>¥{schedTotal.toLocaleString()}</Text>
          </View>

          <SectionCard>
            {scheduledExpensesData.map((item, idx) => {
              const months = Math.round((item.days ?? 0) / 30);
              const badgeText = months <= 1 ? '今月中' : months < 12 ? `${months}ヶ月後` : `${Math.round(months / 12)}年後`;
              return (
                <TableRow
                  key={item.id}
                  icon={item.icon}
                  iconBg={colors.orange + '18'}
                  title={item.name}
                  subtitle={`${item.scheduled_date} · ${item.memo}`}
                  badge={badgeText}
                  badgeColor={colors.orange}
                  right={`¥${item.amount.toLocaleString()}`}
                  rightColor={colors.orange}
                  last={idx === scheduledExpensesData.length - 1}
                />
              );
            })}
          </SectionCard>
        </>
      )}
    </>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <LargeTitle
        title="支出"
        subtitle="2026年4月"
        nav={{ onPrev: () => {}, onNext: () => {} }}
      />

      {/* Summary — BlurView廃止 */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: colors.bg2 }]}>
          <Text style={[styles.summaryLabel, { color: colors.red }]}>
            今月の支出{hasUsd ? ' (円換算)' : ''}
          </Text>
          <Text style={[styles.summaryAmount, { color: colors.t1 }]}>
            ¥{totalExpense.toLocaleString()}
          </Text>
        </View>

        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: diffUp ? colors.red + '08' : colors.green + '08',
              borderWidth: 1,
              borderColor: diffUp ? colors.red + '18' : colors.green + '18',
            },
          ]}
        >
          <Text style={[styles.summaryLabel, { color: diffUp ? colors.red : colors.green }]}>
            前月比
          </Text>
          <Text style={[styles.summaryAmount, { color: colors.t1 }]}>
            {diffUp ? '+' : ''}¥{diff.toLocaleString()}
          </Text>
          <Text style={[styles.momPct, { color: diffUp ? colors.red : colors.green }]}>
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
  safe: { flex: 1 },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
  },
  summaryLabel: { fontSize: 11, fontWeight: '500' },
  summaryAmount: { fontSize: 20, fontWeight: '500', marginTop: 3 },
  momPct: { fontSize: 11, marginTop: 2 },

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

  emptyState: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 15, fontWeight: '500' },

  // Recurring
  recurringHero: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    padding: 14,
  },
  recurringLabel: { fontSize: 11, fontWeight: '500' },

  // Cards
  cardContainer: { marginHorizontal: 16, marginBottom: 16 },
  usageBarOuter: { paddingTop: 8, paddingHorizontal: 4 },
  usageBarBg: { height: 5, borderRadius: 3, overflow: 'hidden' },
  usageBarInner: { height: 5, borderRadius: 3 },
  usageTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  usagePct: { fontSize: 12 },
  usageLimit: { fontSize: 12 },
  addCardBtn: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addCardText: { fontSize: 14, fontWeight: '500' },

  // Scheduled
  schedHero: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    padding: 14,
  },
  schedLabel: { fontSize: 11, fontWeight: '500' },
  schedAmount: { fontSize: 20, fontWeight: '500', marginTop: 3 },
});
