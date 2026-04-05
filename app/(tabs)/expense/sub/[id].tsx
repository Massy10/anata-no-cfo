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
import { subscriptionsData } from '@/constants/mockData';

export default function SubscriptionDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const item = subscriptionsData.find((s) => s.id === id);

  if (!item) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
        <NavBar title="サブスク詳細" onBack={() => router.back()} />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.t2 }]}>
            データが見つかりません
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <NavBar
        title="サブスク詳細"
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
          <Text style={[styles.heroAmount, { color: colors.purple }]}>
            ¥{item.amount.toLocaleString()}/{item.cycle}
          </Text>
        </View>

        {/* Properties */}
        <SectionCard header="プロパティ">
          {[
            ['支払カード', item.card],
            ['課金サイクル', item.cycle],
            ['次回支払日', item.next_payment_date],
          ].map(([label, value], i) => (
            <TableRow
              key={i}
              title={label}
              right={value}
              rightColor={colors.t2}
              last={i === 2}
            />
          ))}
        </SectionCard>

        {/* Actions */}
        <SectionCard header="アクション">
          {[
            ['一時停止', colors.orange],
            ['解約', colors.red],
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
    paddingTop: 12,
    paddingBottom: 20,
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
    fontSize: 28,
    fontWeight: '300',
    marginTop: 8,
  },
});
