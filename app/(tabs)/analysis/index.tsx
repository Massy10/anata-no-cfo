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
import { TableRow } from '@/components/ui/TableRow';
import { ChartBars } from '@/components/ui/ChartBars';
import { Legend } from '@/components/ui/Legend';
import { CfoEntryCard } from '@/components/cards/CfoEntryCard';
import { toJPY } from '@/lib/fx';
import {
  incomeData,
  expenseData,
  actualChartData,
  forecastChartData,
} from '@/constants/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function AnalysisScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { cfoProfile } = useAuth();
  const [chartExpanded, setChartExpanded] = useState(false);

  const totalIncome = useMemo(
    () =>
      incomeData.reduce(
        (sum, item) => sum + toJPY(item.amount, item.currency),
        0,
      ),
    [],
  );

  const totalExpense = useMemo(
    () =>
      expenseData.reduce(
        (sum, item) => sum + toJPY(Math.abs(item.amount), item.currency),
        0,
      ),
    [],
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
    { name: '\u73fe\u91d1', amount: 18000, color: colors.orange },
    { name: '\u30af\u30ec\u30ab', amount: 95000, color: colors.blue },
    { name: '\u96fb\u5b50\u30de\u30cd\u30fc', amount: 32000, color: colors.green },
    { name: '\u5f15\u304d\u843d\u3068\u3057', amount: 45000, color: colors.cyan },
    { name: '\u9280\u884c\u632f\u8fbc', amount: 15000, color: colors.purple },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* A. LargeTitle */}
        <LargeTitle title="\u5206\u6790" />

        {/* B. Hero Card */}
        <HeroCard variant={isPositive ? 'positive' : 'negative'}>
          <Text
            style={[
              styles.heroLabel,
              { color: isPositive ? colors.green : colors.red },
            ]}
          >
            {'\u4eca\u6708\u306e\u7d14\u30ad\u30e3\u30c3\u30b7\u30e5\u30d5\u30ed\u30fc'}
          </Text>
          <Text style={[styles.heroAmount, { color: colors.t1 }]}>
            {isPositive ? '+' : '-'}
            {'\u00a5'}
            {Math.abs(netCF).toLocaleString()}
          </Text>
        </HeroCard>

        {/* C. Three Sub-Cards */}
        <View style={styles.subCardsRow}>
          <SummaryCard
            label="\u53ce\u5165"
            value={'\u00a5' + totalIncome.toLocaleString()}
            color={colors.green}
          />
          <SummaryCard
            label="\u652f\u51fa"
            value={'\u00a5' + totalExpense.toLocaleString()}
            color={colors.red}
          />
          <SummaryCard
            label="\u524d\u6708\u6bd4"
            value={
              (expenseUp ? '\u2191' : '\u2193') +
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
              ? '\u904e\u53bb6\u30f6\u6708\u306e\u5b9f\u7e3e'
              : '\u904e\u53bb3\u30f6\u6708\u306e\u5b9f\u7e3e'
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
                  ? '3\u30f6\u6708\u306b\u623b\u3059'
                  : '\u904e\u53bb6\u30f6\u6708\u3092\u8868\u793a \u2192'}
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
          header="12\u30f6\u6708\u4e88\u6e2c"
          footer="\u30b5\u30d6\u30b9\u30af\u30fb\u4e88\u5b9a\u652f\u51fa\u3092\u542b\u3080\u4e88\u6e2c\u3067\u3059"
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
                  barWidth={24}
                />
              </View>
              <View
                style={[
                  styles.fadedOverlay,
                  { backgroundColor: colors.bg + 'CC' },
                ]}
              >
                <View
                  style={[
                    styles.proBadge,
                    {
                      backgroundColor: colors.blue + '14',
                      borderColor: colors.blue,
                    },
                  ]}
                >
                  <Text style={[styles.proBadgeText, { color: colors.blue }]}>
                    Pro {'\u9650\u5b9a'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Summary box */}
            <View
              style={[styles.summaryBox, { backgroundColor: colors.bg2 }]}
            >
              <Text style={[styles.summaryLabel, { color: colors.t3 }]}>
                {'12\u30f6\u6708\u7d2f\u7a4dCF\u4e88\u6e2c'}
              </Text>
              <Text
                style={[
                  styles.summaryAmount,
                  { color: forecastPositive ? colors.green : colors.red },
                ]}
              >
                {forecastPositive ? '+' : '-'}
                {'\u00a5'}
                {Math.abs(forecastNetTotal).toLocaleString()}
              </Text>
              <Text style={[styles.summaryWarning, { color: colors.t3 }]}>
                {'\u26a0 8\u6708: \u7d50\u5a5a\u5f0f \u00a5300,000'}
              </Text>
            </View>

            {/* Pro CTA */}
            <TouchableOpacity
              style={[styles.proCta, { backgroundColor: colors.blue + '14' }]}
              onPress={() => router.push('/settings')}
            >
              <Text style={[styles.proCtaText, { color: colors.blue }]}>
                {'Pro \u306712\u30f6\u6708\u306e\u4e88\u6e2c\u3092\u8868\u793a \u2192'}
              </Text>
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* G. Payment Method Breakdown */}
        <SectionCard header={'\u652f\u6255\u624b\u6bb5\u5225\uff08\u4eca\u6708\uff09'}>
          {paymentMethods.map((pm, i) => (
            <TableRow
              key={pm.name}
              icon={undefined}
              title={pm.name}
              right={'\u00a5' + pm.amount.toLocaleString()}
              last={i === paymentMethods.length - 1}
            />
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
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 40,
    fontWeight: '600',
    letterSpacing: -0.5,
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
    marginTop: 8,
  },
  toggleText: {
    fontSize: 13,
  },
  fadedContainer: {
    marginTop: 12,
    position: 'relative',
  },
  fadedBars: {
    opacity: 0.25,
  },
  fadedOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  proBadge: {
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  summaryBox: {
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  summaryLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 4,
  },
  summaryWarning: {
    fontSize: 11,
  },
  proCta: {
    borderRadius: 10,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  proCtaText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
