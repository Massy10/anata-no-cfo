import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { spacing } from '@/theme/tokens';
import { SectionCard } from '@/components/ui/SectionCard';
import { TableRow } from '@/components/ui/TableRow';
import { getRate, toJPY } from '@/lib/fx';
import { expenseData } from '@/constants/mockData';

export default function EditExpenseScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = expenseData.find((e) => e.id === id);

  const [currency, setCurrency] = useState<'JPY' | 'USD'>(item?.currency ?? 'JPY');

  if (!item) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
        <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.bg3 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.t2 }}>データが見つかりません</Text>
        </View>
      </SafeAreaView>
    );
  }

  const rate = getRate(item.date);
  const isUSD = currency === 'USD';
  const sym = isUSD ? '$' : '¥';
  const isFixed = item.type === 'fixed';

  const handleSave = () => {
    Alert.alert('保存完了', '支出データを更新しました。', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      {/* Modal handle */}
      <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
        <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.bg3 }} />
      </View>
      {/* Modal nav */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ minWidth: 44 }}>
          <Text style={{ fontSize: 17, color: colors.blue }}>キャンセル</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: '600', color: colors.t1 }}>支出を編集</Text>
        <TouchableOpacity onPress={handleSave} style={{ minWidth: 44, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.red }}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: spacing.screenPaddingBottom }} showsVerticalScrollIndicator={false}>
        {/* Amount display */}
        <View style={styles.amountSection}>
          <Text style={[styles.amountHint, { color: colors.t2 }]}>金額をタップして変更</Text>
          <Text style={[styles.amountDisplay, { color: colors.red }]}>
            {sym}{item.amount.toLocaleString()}
          </Text>
          {isUSD && (
            <Text style={{ fontSize: 13, color: colors.t2, marginTop: 2 }}>
              ≒ ¥{toJPY(item.amount, 'USD', item.date).toLocaleString()} (@{rate})
            </Text>
          )}
        </View>

        {/* Currency toggle */}
        <View style={styles.currencyRow}>
          {(['JPY', 'USD'] as const).map((v) => {
            const active = currency === v;
            return (
              <TouchableOpacity
                key={v}
                style={[styles.currencyPill, {
                  backgroundColor: active ? `${colors.blue}22` : 'transparent',
                  borderColor: active ? `${colors.blue}44` : colors.sep,
                  borderWidth: 0.5,
                }]}
                onPress={() => setCurrency(v)}
              >
                <Text style={[styles.currencyText, {
                  color: active ? colors.blue : colors.t3,
                  fontWeight: active ? '600' : '400',
                }]}>
                  {v === 'JPY' ? '🇯🇵 JPY' : '🇺🇸 USD'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <SectionCard>
          {[
            { l: '名称', v: item.name },
            { l: '支払方法', v: item.payment_method },
            { l: 'カテゴリ', v: item.tag },
            { l: '種別', v: isFixed ? '固定費' : '変動費' },
            { l: '日付', v: item.date },
          ].map((f, i, arr) => (
            <TableRow
              key={i}
              title={f.l}
              right={f.v}
              rightColor={f.l === '種別' ? (isFixed ? colors.cyan : colors.red) : colors.t2}
              last={i === arr.length - 1}
              onPress={() => {}}
            />
          ))}
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  amountSection: { alignItems: 'center', paddingTop: 8, paddingBottom: 4 },
  amountHint: { fontSize: 11, marginBottom: 4 },
  amountDisplay: { fontSize: 48, fontWeight: '200' },
  currencyRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingTop: 4, paddingBottom: 16 },
  currencyPill: { paddingVertical: 6, paddingHorizontal: 18, borderRadius: 8 },
  currencyText: { fontSize: 13 },
});
