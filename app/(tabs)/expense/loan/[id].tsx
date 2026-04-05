import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { radius, fontSize, spacing } from '@/theme/tokens';
import { NavBar } from '@/components/ui/NavBar';
import { SectionCard } from '@/components/ui/SectionCard';
import { TableRow } from '@/components/ui/TableRow';
import { calcMonthly, calcTotal } from '@/lib/loan';
import { loansData } from '@/constants/mockData';

export default function LoanDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const item = loansData.find((l) => l.id === id);

  // Simulation state - initialize after finding item
  const [simRate, setSimRate] = useState(item?.annual_rate ?? 1);
  const [simTerm, setSimTerm] = useState(item?.term_years ?? 10);

  if (!item) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
        <NavBar title="ローン詳細" onBack={() => router.back()} />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.t2 }]}>
            データが見つかりません
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const monthly = calcMonthly(item.principal, item.annual_rate, item.term_years);
  const total = calcTotal(item.principal, item.annual_rate, item.term_years);
  const interest = total - item.principal;

  // Simulation
  const simMonthly = useMemo(
    () => calcMonthly(item.principal, simRate, simTerm),
    [item.principal, simRate, simTerm],
  );
  const simTotal = useMemo(
    () => calcTotal(item.principal, simRate, simTerm),
    [item.principal, simRate, simTerm],
  );
  const simInterest = simTotal - item.principal;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <NavBar
        title="ローン詳細"
        onBack={() => router.back()}
        rightAction={{ label: '編集', onPress: () => {} }}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.screenPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero section */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{item.icon}</Text>
          <Text style={[styles.heroName, { color: colors.t1 }]}>{item.name}</Text>
          <Text style={[styles.heroAmount, { color: colors.orange }]}>
            ¥{monthly.toLocaleString()}
            <Text style={{ fontSize: 17, color: colors.t2 }}>/月</Text>
          </Text>
        </View>

        {/* Loan info */}
        <SectionCard header="ローン情報">
          {[
            ['借入先', item.bank_name],
            ['借入額', `¥${item.principal.toLocaleString()}`],
            ['金利（年）', `${item.annual_rate}%`],
            ['返済期間', `${item.term_years}年（${item.term_years * 12}回）`],
            ['返済開始', item.start_date],
            ['総支払額', `¥${total.toLocaleString()}`],
            ['うち利息', `¥${interest.toLocaleString()}`],
          ].map(([label, value], i) => (
            <TableRow
              key={i}
              title={label}
              right={value}
              rightColor={i >= 5 ? colors.orange : colors.t2}
              last={i === 6}
            />
          ))}
        </SectionCard>

        {/* Simulation */}
        <SectionCard
          header="返済シミュレーション"
          footer="金利・期間を変更すると毎月の支払額が即時算出されます"
        >
          <View style={{ padding: 16 }}>
            {/* Rate slider */}
            <View style={{ marginBottom: 16 }}>
              <View style={styles.sliderHeader}>
                <Text style={[styles.sliderLabel, { color: colors.t2 }]}>金利（年）</Text>
                <Text style={[styles.sliderValue, { color: colors.orange }]}>{simRate.toFixed(2)}%</Text>
              </View>
              <View
                style={[styles.sliderTrack, { backgroundColor: colors.fill }]}
              >
                <View
                  style={[
                    styles.sliderFill,
                    {
                      backgroundColor: colors.orange,
                      width: `${(simRate / 5) * 100}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.sliderRangeRow}>
                <Text style={[styles.sliderRangeText, { color: colors.t3 }]}>0%</Text>
                <Text style={[styles.sliderRangeText, { color: colors.t3 }]}>5%</Text>
              </View>
            </View>

            {/* Term slider */}
            <View style={{ marginBottom: 16 }}>
              <View style={styles.sliderHeader}>
                <Text style={[styles.sliderLabel, { color: colors.t2 }]}>返済期間</Text>
                <Text style={[styles.sliderValue, { color: colors.orange }]}>{simTerm}年</Text>
              </View>
              <View
                style={[styles.sliderTrack, { backgroundColor: colors.fill }]}
              >
                <View
                  style={[
                    styles.sliderFill,
                    {
                      backgroundColor: colors.orange,
                      width: `${((simTerm - 1) / 49) * 100}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.sliderRangeRow}>
                <Text style={[styles.sliderRangeText, { color: colors.t3 }]}>1年</Text>
                <Text style={[styles.sliderRangeText, { color: colors.t3 }]}>50年</Text>
              </View>
            </View>

            {/* Results */}
            <View style={[styles.simResult, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.sep }]}>
              <View>
                <Text style={{ fontSize: 11, color: colors.t2 }}>毎月の支払額</Text>
                <Text style={{ fontSize: 28, fontWeight: '300', color: colors.orange, marginTop: 2 }}>
                  ¥{simMonthly.toLocaleString()}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 11, color: colors.t2 }}>総利息額</Text>
                <Text style={{ fontSize: 17, fontWeight: '400', color: colors.red, marginTop: 2 }}>
                  ¥{simInterest.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </SectionCard>

        {/* Actions */}
        <SectionCard header="アクション">
          {[
            ['繰上返済を記録', colors.blue],
            ['条件変更', colors.orange],
            ['削除', colors.red],
          ].map(([label, color], i) => (
            <TableRow
              key={i}
              title={label}
              rightColor={color}
              last={i === 2}
              onPress={() => {}}
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: fontSize.body,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
  },
  heroEmoji: {
    fontSize: 48,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 8,
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: '300',
    marginTop: 8,
  },
  // Slider
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sliderLabel: {
    fontSize: 13,
  },
  sliderValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: 6,
    borderRadius: 3,
  },
  sliderRangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderRangeText: {
    fontSize: 11,
  },
  // Sim result
  simResult: {
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
});
