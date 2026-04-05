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
import { LinearGradient } from 'expo-linear-gradient';

export default function AnalysisScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { cfoProfile } = useAuth();
  const [chartExpanded, setChartExpanded] = useState(false);

  const { data: incomeData } = useIncome();
  const { data: expenseData } = useExpenses();

  const totalIncome = useMemo(
    () =>
      incomeData.reduce(
        (sum, item) => sum + toJPY(item.amount, item.currency),
        0,
      ),
    [incomeData],
  );

  const totalExpense = useMemo(
    () =>
      expenseData.reduce(
        (sum, item) => sum + toJPY(Math.abs(item.amount), item.currency),
        0,
      ),
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
  const forecastPositive = forecastNetTotal >= 0;

  const paymentMethods = [
    { name: '現金', amount: 18000, color: colors.orange },
    { name: 'クレカ', amount: 95000, color: colors.blue },
    { name: '電子マネー', amount: 32000, color: colors.green },
    { name: '引き落とし', amount: 45000, color: colors.cyan },
    { name: '銀行振込', amount: 15000, color: colors.purple },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* A. LargeTitle */}
        <LargeTitle title="分析" />

        {/* B. Hero Card */}
        <HeroCard variant={isPositive ? 'positive' : 'negative'}>
          <Text
            style={[
              styles.heroLabel,
              { color: isPositive ? colors.green : colors.red },
            ]}
          >
            {'今月の純キャッシュフロー'}
          </Text>
          <Text style={[styles.heroAmount, { color: colors.t1 }]}>
            {isPositive ? '+' : '-'}
            {'¥'}
            {Math.abs(netCF).toLocaleString()}
          </Text>
        </HeroCard>

        {/* C. Three Sub-Cards */}
        <View style={styles.subCardsRow}>
          <SummaryCard
            label="収入"
            value={'¥' + totalIncome.toLocaleString()}
            color={colors.green}
          />
          <SummaryCard
            label="支出"
            value={'¥' + totalExpense.toLocaleString()}
            color={colors.red}
          />
          <SummaryCard
            label="前月比"
            value={
              (expenseUp ? '↑' : '↓') +
              Math.abs(expenseChange).toFixed(1) +
              '%'
            }
            color={expenseUp ? colors.red : colors.green}
            variant="outline"
          />
        </View>

        {/* D. Chart Section */}
        <SectionCard
          header={
            chartExpanded
              ? '過去6ヶ月の実績'
              : '過去3ヶ月の実績'
          }
        >
          <View style={styles.chartPad}>
            <ChartBars
              data={actualChartData}
              count={chartExpanded ? 6 : 3}
              barWidth={chartExpanded ? 16 : 28}
            />
            <Legend />
            <TouchableOpacity
              style={styles.toggleLink}
              onPress={() => setChartExpanded(!chartExpanded)}
            >
              <Text style={[styles.toggleText, { color: colors.blue }]}>
                {chartExpanded
                  ? '3ヶ月に戻す'
                  : '過去6ヶ月を表示 →'}
              </Text>
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* E. CFO Chat Entry */}
        <CfoEntryCard
          onPress={() => router.push('/analysis/cfo-chat')}
          cfoName={cfoProfile?.cfoName}
        />

        {/* F. Forecast Teaser */}
        <SectionCard
          header="12ヶ月予測"
          footer="サブスク・予定支出を含む予測です"
        >
          <View style={styles.chartPad}>
            {/* First 2 months visible */}
            <ChartBars
              data={forecastChartData}
              count={2}
              dashed
              barWidth={24}
            />

            {/* Blurred/faded section */}
            <View style={styles.fadedContainer}>
              <View style={styles.fadedBars}>
                <ChartBars
                  data={forecastChartData.slice(2, 6)}
                  dashed
                  barWidth={16}
                />
              </View>
              <LinearGradient
                colors={['transparent', colors.bg]}
                start={{ x: 0.1, y: 0.5 }}
                end={{ x: 0.85, y: 0.5 }}
                style={styles.fadedOverlay}
              >
                <View
                  style={[
                    styles.proBadge,
                    {
                      backgroundColor: colors.blue + '15',
                      borderColor: colors.blue + '33',
                    },
                  ]}
                >
                  <Text style={[styles.proBadgeText, { color: colors.blue }]}>
                    Pro {'限定'}
                  </Text>
                </View>
              </LinearGradient>
            </View>

            {/* Summary box */}
            <View
              style={[styles.summaryBox, { backgroundColor: colors.bg2 }]}
            >
              <Text style={[styles.summaryLabel, { color: colors.t3 }]}>
                {'12ヶ月累積CF予測'}
              </Text>
              <Text
                style={[
                  styles.summaryAmount,
                  { color: forecastPositive ? colors.green : colors.red },
                ]}
              >
                {forecastPositive ? '+' : '-'}
                {'¥'}
                {Math.abs(forecastNetTotal).toLocaleString()}
              </Text>
              <Text style={[styles.summaryWarning, { color: colors.t3 }]}>
                {'⚠ 8月: 結婚式 ¥300,000'}
              </Text>
            </View>

            {/* Pro CTA */}
            <TouchableOpacity
              style={[styles.proCta, { backgroundColor: colors.blue + '15', borderColor: colors.blue + '33' }]}
              onPress={() => router.push('/settings')}
            >
              <Text style={[styles.proCtaText, { color: colors.blue }]}>
                {'Proで12ヶ月の予測を表示 →'}
              </Text>
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* G. Payment Method Breakdown */}
        <SectionCard header={'支払手段別（今月）'}>
          {paymentMethods.map((pm, i) => (
            <View
              key={pm.name}
              style={[
                styles.pmRow,
                i < paymentMethods.length - 1 && {
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.sep,
                },
              ]}
            >
              <View
                style={[styles.pmDot, { backgroundColor: pm.color }]}
              />
              <Text style={[styles.pmTitle, { color: colors.t1 }]}>
                {pm.name}
              </Text>
              <Text style={[styles.pmRight, { color: colors.t2 }]}>
                {'¥' + pm.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.screenPaddingBottom,
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontSize: 40,
    fontWeight: '600',
    letterSpacing: -0.5,
    marginTop: 6,
  },
  subCardsRow: {
    flexDirection: 'row',
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  chartPad: {
    padding: 16,
  },
  toggleLink: {
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
  },
  toggleText: {
    fontSize: 13,
  },
  fadedContainer: {
    marginTop: 8,
    position: 'relative',
  },
  fadedBars: {
    opacity: 0.25,
  },
  fadedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 12,
  },
  proBadge: {
    borderWidth: 0.5,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  summaryBox: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  summaryLabel: {
    fontSize: 11,
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '300',
    marginTop: 2,
  },
  summaryWarning: {
    fontSize: 11,
    marginTop: 4,
  },
  proCta: {
    borderRadius: 10,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    padding: 14,
    borderWidth: 0.5,
  },
  proCtaText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  pmDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
    marginRight: 12,
  },
  pmTitle: {
    fontSize: 17,
    flex: 1,
  },
  pmRight: {
    fontSize: 17,
    marginLeft: 8,
  },
});
