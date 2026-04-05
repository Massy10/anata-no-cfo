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
import { HeroCard } from '@/components/cards/HeroCard';
import { SummaryCard } from '@/components/cards/SummaryCard';
import { SectionCard } from '@/components/ui/SectionCard';
import { ChartBars } from '@/components/ui/ChartBars';
import { Legend } from '@/components/ui/Legend';
import { CfoEntryCard } from '@/components/cards/CfoEntryCard';
import { toJPY } from '@/lib/fx';
import { actualChartData, forecastChartData } from '@/constants/mockData';
import { useIncome } from '@/hooks/useIncome';
import { useExpenses } from '@/hooks/useExpenses';
import { useAuth } from '@/contexts/AuthContext';

export default function AnalysisScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { cfoProfile } = useAuth();
  const [chartExpanded, setChartExpanded] = useState(false);

  const { data: incomeData } = useIncome();
  const { data: expenseData } = useExpenses();

  const totalIncome = useMemo(
    () => incomeData.reduce((sum, item) => sum + toJPY(item.amount, item.currency), 0),
    [incomeData],
  );

  const totalExpense = useMemo(
    () => expenseData.reduce((sum, item) => sum + toJPY(Math.abs(item.amount), item.currency), 0),
    [expenseData],
  );

  const netCF = totalIncome - totalExpense;
  const isPositive = netCF >= 0;

  const lastMonth = 310000;
  const expenseChange = ((totalExpense - lastMonth) / lastMonth) * 100;
  const expenseUp = expenseChange >= 0;

  const forecastNetTotal = useMemo(
    () => forecastChartData.reduce((sum, d) => sum + (d.inc - d.exp), 0),
    [],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LargeTitle title="分析" />

        {/* ① 主役：今月の純キャッシュフロー */}
        <HeroCard variant={isPositive ? 'positive' : 'negative'}>
          <Text style={[styles.heroLabel, { color: isPositive ? colors.green : colors.red }]}>
            今月の純キャッシュフロー
          </Text>
          <Text style={[styles.heroAmount, { color: colors.t1 }]}>
            {isPositive ? '+' : ''}¥{Math.abs(netCF).toLocaleString()}
          </Text>
        </HeroCard>

        {/* ② 比較：収入・支出・前月比 */}
        <View style={styles.summaryRow}>
          <SummaryCard label="収入" value={'¥' + totalIncome.toLocaleString()} color={colors.green} />
          <SummaryCard label="支出" value={'¥' + totalExpense.toLocaleString()} color={colors.red} />
          <SummaryCard
            label="前月比"
            value={(expenseUp ? '↑' : '↓') + Math.abs(expenseChange).toFixed(1) + '%'}
            color={expenseUp ? colors.red : colors.green}
          />
        </View>

        {/* ③ 根拠：過去の実績チャート */}
        <SectionCard header={chartExpanded ? '過去6ヶ月の実績' : '過去3ヶ月の実績'}>
          <View style={styles.chartPad}>
            <ChartBars
              data={actualChartData}
              count={chartExpanded ? 6 : 3}
              barWidth={chartExpanded ? 14 : 24}
            />
            <Legend />
            <TouchableOpacity
              style={styles.toggleLink}
              onPress={() => setChartExpanded(!chartExpanded)}
            >
              <Text style={[styles.toggleText, { color: colors.blue }]}>
                {chartExpanded ? '3ヶ月に戻す' : '6ヶ月を表示'}
              </Text>
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* ④ 行動：CFOに相談 */}
        <CfoEntryCard
          onPress={() => router.push('/analysis/cfo-chat')}
          cfoName={cfoProfile?.cfoName}
        />

        {/* ⑤ 参考：12ヶ月予測（Pro誘導） */}
        <SectionCard header="12ヶ月予測" footer="サブスク・予定支出を含む試算です">
          <View style={styles.chartPad}>
            <ChartBars data={forecastChartData} count={2} dashed barWidth={20} />

            <View style={[styles.forecastSummary, { backgroundColor: colors.bg }]}>
              <Text style={[styles.forecastLabel, { color: colors.t2 }]}>
                12ヶ月累積CF予測
              </Text>
              <Text style={[styles.forecastAmount, {
                color: forecastNetTotal >= 0 ? colors.green : colors.red,
              }]}>
                {forecastNetTotal >= 0 ? '+' : ''}¥{Math.abs(forecastNetTotal).toLocaleString()}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.proCta, { borderColor: colors.purple + '30' }]}
              onPress={() => router.push('/settings')}
            >
              <Text style={[styles.proCtaText, { color: colors.purple }]}>
                Proで全期間の予測を表示
              </Text>
            </TouchableOpacity>
          </View>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.screenPaddingBottom },

  heroLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: '600',
    letterSpacing: -0.5,
    marginTop: 4,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 16,
  },

  chartPad: { padding: 16 },
  toggleLink: {
    alignItems: 'center',
    minHeight: 40,
    justifyContent: 'center',
    marginTop: 8,
  },
  toggleText: { fontSize: 13, fontWeight: '500' },

  forecastSummary: {
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  forecastLabel: { fontSize: 12 },
  forecastAmount: {
    fontSize: 22,
    fontWeight: '500',
    marginTop: 2,
  },

  proCta: {
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 10,
  },
  proCtaText: { fontSize: 14, fontWeight: '500' },
});
