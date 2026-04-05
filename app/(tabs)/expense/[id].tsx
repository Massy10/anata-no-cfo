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
                backgroundColor: colors.red + '14',
                shadowColor: colors.heroShadow,
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
              ≒ ¥{jpyAmt.toLocaleString()} (@{rate})
            </Text>
          )}
        </View>

        {/* Properties */}
        <SectionCard header="プロパティ">
          <TableRow icon="💳" title="支払手段" right={item.method} />
          <TableRow icon="🏷" title="用途タグ" right={item.tag} />
          <TableRow icon="📅" title="日付" right={item.date} />
          <TableRow icon="📊" title="種別" right={typeLabel} />
          <TableRow
            icon="💱"
            title="通貨"
            right={item.currency}
            last={!isUSD}
          />
          {isUSD && (
            <>
              <TableRow
                icon="📈"
                title="レート"
                right={`¥${rate} / USD`}
              />
              <TableRow
                icon="💴"
                title="円換算額"
                right={`¥${jpyAmt.toLocaleString()}`}
                rightColor={colors.green}
                last
              />
            </>
          )}
        </SectionCard>

        {/* Actions */}
        <SectionCard header="アクション">
          <TableRow
            icon="📋"
            title="複製"
            iconBg={colors.blue + '21'}
            rightColor={colors.blue}
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
    fontSize: 36,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: fontSize.detailAmount,
    fontWeight: '500',
  },
  heroSub: {
    fontSize: 15,
    marginTop: 4,
  },
});
