import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { fontSize, spacing } from '@/theme/tokens';
import { SectionCard } from '@/components/ui/SectionCard';
import { TableRow } from '@/components/ui/TableRow';
import { toJPY, getRate } from '@/lib/fx';
import { useIncome } from '@/hooks/useIncome';

export default function IncomeDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: incomeData, remove } = useIncome();

  const item = incomeData.find((i) => i.id === id);

  if (!item) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
        <View style={styles.handle}>
          <View style={[styles.handleBar, { backgroundColor: colors.bg3 }]} />
        </View>
        <View style={styles.modalNav}>
          <View style={{ width: 44 }} />
          <Text style={[styles.navTitle, { color: colors.t1 }]}>収入詳細</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.navRight}>
            <Text style={[styles.navAction, { color: colors.blue }]}>完了</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.t2 }]}>データが見つかりません</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isUSD = item.currency === 'USD';
  const rate = getRate(item.date);
  const jpyAmt = isUSD ? toJPY(item.amount, item.currency, item.date) : item.amount;
  const sym = isUSD ? '$' : '¥';

  const handleDelete = () => {
    Alert.alert(
      '収入を削除',
      `「${item.name}」（${sym}${item.amount.toLocaleString()}）を削除しますか？\nこの操作は取り消せません。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await remove(item.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={styles.handle}>
        <View style={[styles.handleBar, { backgroundColor: colors.bg3 }]} />
      </View>
      <View style={styles.modalNav}>
        <View style={{ width: 44 }} />
        <Text style={[styles.navTitle, { color: colors.t1 }]}>収入詳細</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.navRight}>
          <Text style={[styles.navAction, { color: colors.blue }]}>完了</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.screenPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: colors.green + '12' }]}>
            <Text style={styles.heroEmoji}>{item.icon}</Text>
          </View>
          <Text style={[styles.heroName, { color: colors.t1 }]}>{item.name}</Text>
          <Text style={[styles.heroAmount, { color: colors.green }]}>
            +{sym}{item.amount.toLocaleString()}
          </Text>
          {isUSD && (
            <Text style={[styles.heroSub, { color: colors.t2 }]}>
              ≒ ¥{jpyAmt.toLocaleString()} (@{rate})
            </Text>
          )}
        </View>

        {/* Properties */}
        <SectionCard header="プロパティ">
          {[
            ['受取方法', item.payment_method],
            ['カテゴリ', item.tag],
            ['日付', item.date],
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
              rightColor={label === '円換算額' ? colors.green : colors.t2}
              last={i === arr.length - 1}
            />
          ))}
        </SectionCard>

        {/* Actions */}
        <SectionCard>
          <TableRow
            title="編集"
            onPress={() => router.push(`/income/edit/${item.id}`)}
            last
          />
        </SectionCard>

        {/* Delete — 独立・赤文字 */}
        <TouchableOpacity
          style={[styles.deleteButton, { borderColor: colors.red + '20' }]}
          onPress={handleDelete}
          activeOpacity={0.6}
        >
          <Text style={[styles.deleteText, { color: colors.red }]}>この収入を削除</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  handle: { alignItems: 'center', paddingTop: 8, paddingBottom: 4 },
  handleBar: { width: 36, height: 4, borderRadius: 2 },
  modalNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 10,
  },
  navTitle: { fontSize: 17, fontWeight: '600' },
  navRight: { minWidth: 44, alignItems: 'flex-end' },
  navAction: { fontSize: 17 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.body },
  hero: { alignItems: 'center', paddingTop: 16, paddingBottom: 24 },
  heroIcon: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 32 },
  heroName: { fontSize: 20, fontWeight: '600', marginTop: 12 },
  heroAmount: { fontSize: 34, fontWeight: '500', marginTop: 6 },
  heroSub: { fontSize: 14, marginTop: 4 },
  deleteButton: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  deleteText: { fontSize: 16, fontWeight: '500' },
});
