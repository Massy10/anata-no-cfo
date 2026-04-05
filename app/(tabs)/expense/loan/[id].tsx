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
  const [simRate, setSimRate] = useState(item?.annualRate ?? 1);
  const [simTerm, setSimTerm] = useState(item?.termYears ?? 10);

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

  const monthly = calcMonthly(item.principal, item.annualRate, item.termYears);
  const total = calcTotal(item.principal, item.annualRate, item.termYears);
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
          <View
            style={[
              styles.heroIcon,
              {
                backgroundColor: colors.orange + '14',
                shadowColor: colors.heroShadow,
              },
            ]}
          >
            <Text style={styles.heroEmoji}>{item.icon}</Text>
          </View>
          <Text style={[styles.heroName, { color: colors.t1 }]}>{item.name}</Text>
          <Text style={[styles.heroAmount, { color: colors.orange }]}>
            ¥{monthly.toLocaleString()}/月
          </Text>
        </View>

        {/* Loan info */}
        <SectionCard header="ローン情報">
          <TableRow icon="🏦" title="借入先" right={item.lender} />
          <TableRow
            icon="💰"
            title="借入額"
            right={`¥${item.principal.toLocaleString()}`}
          />
          <TableRow
            icon="📊"
            title="金利（年）"
            right={`${item.annualRate}%`}
          />
          <TableRow icon="📅" title="返済期間" right={`${item.termYears}年`} />
          <TableRow icon="🗓" title="返済開始" right={item.startDate} />
          <TableRow
            icon="💵"
            title="総支払額"
            right={`¥${total.toLocaleString()}`}
          />
          <TableRow
            icon="📉"
            title="うち利息"
            right={`¥${interest.toLocaleString()}`}
            rightColor={colors.red}
            last
          />
        </SectionCard>

        {/* Simulation */}
        <SectionCard
          header="返済シミュレーション"
          footer="金利・期間を変更すると毎月の支払額が即時算出されます"
        >
          {/* Rate slider */}
          <View style={styles.sliderRow}>
            <Text style={[styles.sliderLabel, { color: colors.t2 }]}>
              金利（年）
            </Text>
            <View style={styles.sliderControl}>
              <View
                style={[
                  styles.sliderTrack,
                  { backgroundColor: colors.fill },
                ]}
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
              <TextInput
                style={[
                  styles.sliderInput,
                  { color: colors.t1, borderColor: colors.sep, backgroundColor: colors.bg2 },
                ]}
                value={simRate.toFixed(2)}
                onChangeText={(v) => {
                  const n = parseFloat(v);
                  if (!isNaN(n) && n >= 0 && n <= 5) setSimRate(n);
                }}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.sliderUnit, { color: colors.t2 }]}>%</Text>
            </View>
            <Text style={[styles.sliderRange, { color: colors.t3 }]}>
              0% ~ 5%
            </Text>
          </View>

          {/* Term slider */}
          <View style={[styles.sliderRow, { borderTopWidth: 0.5, borderTopColor: colors.sep }]}>
            <Text style={[styles.sliderLabel, { color: colors.t2 }]}>
              返済期間
            </Text>
            <View style={styles.sliderControl}>
              <View
                style={[
                  styles.sliderTrack,
                  { backgroundColor: colors.fill },
                ]}
              >
                <View
                  style={[
                    styles.sliderFill,
                    {
                      backgroundColor: colors.orange,
                      width: `${(simTerm / 50) * 100}%`,
                    },
                  ]}
                />
              </View>
              <TextInput
                style={[
                  styles.sliderInput,
                  { color: colors.t1, borderColor: colors.sep, backgroundColor: colors.bg2 },
                ]}
                value={String(simTerm)}
                onChangeText={(v) => {
                  const n = parseInt(v, 10);
                  if (!isNaN(n) && n >= 1 && n <= 50) setSimTerm(n);
                }}
                keyboardType="number-pad"
              />
              <Text style={[styles.sliderUnit, { color: colors.t2 }]}>年</Text>
            </View>
            <Text style={[styles.sliderRange, { color: colors.t3 }]}>
              1年 ~ 50年
            </Text>
          </View>

          {/* Result */}
          <View
            style={[
              styles.simResult,
              { borderTopWidth: 0.5, borderTopColor: colors.sep },
            ]}
          >
            <View style={styles.simResultRow}>
              <Text style={[styles.simResultLabel, { color: colors.t2 }]}>
                毎月の支払額
              </Text>
              <Text style={[styles.simResultAmount, { color: colors.orange }]}>
                ¥{simMonthly.toLocaleString()}
              </Text>
            </View>
            <View style={styles.simResultRow}>
              <Text style={[styles.simInterestLabel, { color: colors.t2 }]}>
                総利息額
              </Text>
              <Text style={[styles.simInterestAmount, { color: colors.red }]}>
                ¥{simInterest.toLocaleString()}
              </Text>
            </View>
          </View>
        </SectionCard>

        {/* Actions */}
        <SectionCard header="アクション">
          <TableRow
            icon="💹"
            title="繰上返済を記録"
            iconBg={colors.blue + '21'}
            rightColor={colors.blue}
            onPress={() => {}}
          />
          <TableRow
            icon="📝"
            title="条件変更"
            iconBg={colors.orange + '21'}
            rightColor={colors.orange}
            onPress={() => {}}
          />
          <TableRow
            icon="🗑"
            title="削除"
            iconBg={colors.red + '14'}
            rightColor={colors.red}
            last
            onPress={() => {}}
          />
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
    paddingVertical: 28,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  heroEmoji: {
    fontSize: 48,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: '500',
  },
  // Slider
  sliderRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sliderLabel: {
    fontSize: fontSize.caption,
    marginBottom: 8,
  },
  sliderControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: 6,
    borderRadius: 3,
  },
  sliderInput: {
    width: 64,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: fontSize.body,
    fontWeight: '500',
  },
  sliderUnit: {
    fontSize: fontSize.caption,
    width: 20,
  },
  sliderRange: {
    fontSize: fontSize.smallCaption,
    marginTop: 6,
  },
  // Sim result
  simResult: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  simResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  simResultLabel: {
    fontSize: fontSize.body,
  },
  simResultAmount: {
    fontSize: 28,
    fontWeight: '500',
  },
  simInterestLabel: {
    fontSize: fontSize.body,
  },
  simInterestAmount: {
    fontSize: 17,
    fontWeight: '500',
  },
});
