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
import { CreditCardVisual } from '@/components/cards/CreditCardVisual';
import { useCreditCards } from '@/hooks/useCreditCards';

const PRESET_COLORS = [
  { label: 'グリーン', value: '#00A650' },
  { label: 'レッド', value: '#BF0000' },
  { label: 'ブルー', value: '#007AFF' },
  { label: 'パープル', value: '#AF52DE' },
  { label: 'ゴールド', value: '#C9A84C' },
  { label: 'チャコール', value: '#3A3A3C' },
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function CardDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: creditCardsData, update, remove } = useCreditCards();
  const card = creditCardsData.find((c) => c.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(card?.color ?? '#007AFF');
  const [closingDay, setClosingDay] = useState(card?.closing_day ?? 15);
  const [paymentDay, setPaymentDay] = useState(card?.payment_day ?? 10);

  if (!card) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
        <View style={styles.handle}>
          <View style={[styles.handleBar, { backgroundColor: colors.bg3 }]} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.t2 }}>カードが見つかりません</Text>
        </View>
      </SafeAreaView>
    );
  }

  const usage = card.credit_limit > 0 ? card.balance / card.credit_limit : 0;
  const usagePct = (usage * 100).toFixed(0);
  const barColor = usage > 0.7 ? colors.red : colors.green;

  const displayCard = {
    ...card,
    color: selectedColor,
    closing_day: closingDay,
    payment_day: paymentDay,
  };

  const handleSave = async () => {
    await update(card.id, {
      color: selectedColor,
      closing_day: closingDay,
      payment_day: paymentDay,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'カードを削除',
      `「${card.name}」を削除しますか？\nこのカードに関連するデータには影響しません。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await remove(card.id);
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
        <TouchableOpacity onPress={() => isEditing ? setIsEditing(false) : router.back()} style={{ minWidth: 44 }}>
          <Text style={{ fontSize: 17, color: colors.blue }}>
            {isEditing ? 'キャンセル' : '完了'}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.t1 }]}>
          {isEditing ? 'カードを編集' : 'カード詳細'}
        </Text>
        <TouchableOpacity
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          style={{ minWidth: 44, alignItems: 'flex-end' }}
        >
          <Text style={{ fontSize: 17, fontWeight: '600', color: isEditing ? colors.green : colors.blue }}>
            {isEditing ? '保存' : '編集'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.screenPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Card visual */}
        <View style={styles.previewContainer}>
          <CreditCardVisual card={displayCard} />
          <View style={styles.usageBarOuter}>
            <View style={[styles.usageTextRow, { marginBottom: 4 }]}>
              <Text style={[styles.usageLabel, { color: colors.t2 }]}>利用率 {usagePct}%</Text>
              <Text style={[styles.usageLabel, { color: colors.t3 }]}>限度額 ¥{card.credit_limit.toLocaleString()}</Text>
            </View>
            <View style={[styles.usageBarBg, { backgroundColor: colors.fill }]}>
              <View style={[styles.usageBarInner, {
                backgroundColor: barColor,
                width: `${Math.min(usage * 100, 100)}%`,
              }]} />
            </View>
          </View>
        </View>

        {/* Card info */}
        <SectionCard header="カード情報">
          <TableRow title="カード名" right={card.name} rightColor={colors.t2} />
          <TableRow title="下4桁" right={`•••• ${card.last4}`} rightColor={colors.t2} />
          <TableRow title="限度額" right={`¥${card.credit_limit.toLocaleString()}`} rightColor={colors.t2} />
          <TableRow title="締日" right={`毎月 ${closingDay}日`} rightColor={colors.t2} />
          <TableRow title="支払日" right={`翌月 ${paymentDay}日`} rightColor={colors.t2} last />
        </SectionCard>

        {/* Editing options */}
        {isEditing && (
          <>
            <SectionCard header="カラーを変更">
              <View style={styles.colorRow}>
                {PRESET_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c.value}
                    onPress={() => setSelectedColor(c.value)}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: c.value },
                      selectedColor === c.value && styles.colorSwatchSelected,
                    ]}
                  >
                    {selectedColor === c.value && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </SectionCard>

            <SectionCard header="締日を変更">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexShrink: 0, flexGrow: 0 }}>
                <View style={styles.dayRow}>
                  {DAYS.map((d) => (
                    <TouchableOpacity
                      key={d}
                      onPress={() => setClosingDay(d)}
                      style={[styles.dayPill, {
                        backgroundColor: closingDay === d ? colors.blue : colors.bg2,
                        borderColor: closingDay === d ? colors.blue : colors.sep,
                      }]}
                    >
                      <Text style={[styles.dayText, { color: closingDay === d ? '#FFFFFF' : colors.t2 }]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </SectionCard>

            <SectionCard header="支払日を変更">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexShrink: 0, flexGrow: 0 }}>
                <View style={styles.dayRow}>
                  {DAYS.map((d) => (
                    <TouchableOpacity
                      key={d}
                      onPress={() => setPaymentDay(d)}
                      style={[styles.dayPill, {
                        backgroundColor: paymentDay === d ? colors.green : colors.bg2,
                        borderColor: paymentDay === d ? colors.green : colors.sep,
                      }]}
                    >
                      <Text style={[styles.dayText, { color: paymentDay === d ? '#FFFFFF' : colors.t2 }]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </SectionCard>
          </>
        )}

        {/* Delete — 独立・赤文字 */}
        <TouchableOpacity
          style={[styles.deleteButton, { borderColor: colors.red + '20' }]}
          onPress={handleDelete}
          activeOpacity={0.6}
        >
          <Text style={[styles.deleteText, { color: colors.red }]}>このカードを削除</Text>
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
  previewContainer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  usageBarOuter: { paddingTop: 10, paddingHorizontal: 4 },
  usageTextRow: { flexDirection: 'row', justifyContent: 'space-between' },
  usageLabel: { fontSize: 12 },
  usageBarBg: { height: 5, borderRadius: 3, overflow: 'hidden' },
  usageBarInner: { height: 5, borderRadius: 3 },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16 },
  colorSwatch: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  colorSwatchSelected: { borderWidth: 3, borderColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  checkmark: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  dayRow: { flexDirection: 'row', gap: 8, padding: 12, paddingHorizontal: 16 },
  dayPill: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5 },
  dayText: { fontSize: 14, fontWeight: '500' },
  deleteButton: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  deleteText: { fontSize: 16, fontWeight: '500' },
});
