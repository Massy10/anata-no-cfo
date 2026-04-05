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
          <View
            style={[
              styles.heroIcon,
              {
                backgroundColor: colors.purple + '14',
                shadowColor: colors.heroShadow,
              },
            ]}
          >
            <Text style={styles.heroEmoji}>{item.icon}</Text>
          </View>
          <Text style={[styles.heroName, { color: colors.t1 }]}>{item.name}</Text>
          <Text style={[styles.heroAmount, { color: colors.purple }]}>
            ¥{item.amount.toLocaleString()}/{item.cycle}
          </Text>
        </View>

        {/* Properties */}
        <SectionCard header="プロパティ">
          <TableRow icon="💳" title="支払カード" right={item.card} />
          <TableRow icon="🔄" title="課金サイクル" right={item.cycle} />
          <TableRow
            icon="📅"
            title="次回支払日"
            right={item.nextDate}
            last
          />
        </SectionCard>

        {/* Actions */}
        <SectionCard header="アクション">
          <TableRow
            icon="⏸"
            title="一時停止"
            iconBg={colors.orange + '21'}
            rightColor={colors.orange}
            onPress={() => {}}
          />
          <TableRow
            icon="🗑"
            title="解約"
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
    fontSize: 28,
    fontWeight: '500',
  },
});
