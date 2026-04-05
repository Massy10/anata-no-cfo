import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { radius, fontSize, spacing } from '@/theme/tokens';
import { NavBar } from '@/components/ui/NavBar';
import { SectionCard } from '@/components/ui/SectionCard';
import { TableRow } from '@/components/ui/TableRow';
import { toJPY, getRate } from '@/lib/fx';
import { expenseData } from '@/constants/mockData';

export default function ExpenseDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const item = expenseData.find((e) => e.id === id);

  if (!item) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
        <NavBar title="支出詳細" onBack={() => router.back()} />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.t2 }]}>
            データが見つかりません
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isUSD = item.currency === 'USD';
  const rate = getRate(item.date);
  const jpyAmt = isUSD ? toJPY(item.amount, item.currency, item.date) : item.amount;
  const sym = isUSD ? '$' : '¥';
  const typeLabel = item.type === 'fixed' ? '固定費' : '変動費';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <NavBar
        title="支出詳細"
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
                backgroundColor: colors.red + '12',
                shadowColor: colors.red,
              },
            ]}
          >
            <Text style={styles.heroEmoji}>{item.icon}</Text>
          </View>
          <Text style={[styles.heroName, { color: colors.t1 }]}>{item.name}</Text>
          <Text style={[styles.heroAmount, { color: colors.t1 }]}>
            {sym}{item.amount.toLocaleString()}
          </Text>
          {isUSD && (
            <Text style={[styles.heroSub, { color: colors.t2 }]}>
              ≒ ¥{jpyAmt.toLocaleString()}{' '}
              <Text style={{ fontSize: 11, color: colors.t2 }}>(@{rate})</Text>
            </Text>
          )}
        </View>

        {/* Properties */}
        <SectionCard header="プロパティ">
          {[
            ['支払手段', item.payment_method],
            ['用途タグ', item.tag],
            ['日付', item.date],
            ['種別', typeLabel],
            ['通貨', item.currency],
            ...(isUSD
              ? [
                  ['適用レート', `¥${rate} / USD`],
                  ['円換算額', `¥${jpyAmt.toLocaleString()}`],
                ]
              : []),
          ].map(([label, value], i, arr) => (
            <TableRow
              key={i}
              title={label}
              right={value}
              rightColor={label === '円換算額' ? colors.red : colors.t2}
              last={i === arr.length - 1}
            />
          ))}
        </SectionCard>

        {/* Actions */}
        <SectionCard header="アクション">
          {[
            ['複製', colors.blue],
            ['削除', colors.red],
          ].map(([label, color], i) => (
            <TableRow
              key={i}
              title={label}
              rightColor={color}
              last={i === 1}
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
    paddingTop: 16,
    paddingBottom: 24,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },
  heroEmoji: {
    fontSize: 36,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 12,
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: '500',
    marginTop: 8,
  },
  heroSub: {
    fontSize: 15,
    marginTop: 4,
  },
});
