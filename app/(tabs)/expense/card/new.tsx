import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { spacing } from '@/theme/tokens';
import { SectionCard } from '@/components/ui/SectionCard';
import { TableRow } from '@/components/ui/TableRow';
import { CreditCardVisual } from '@/components/cards/CreditCardVisual';

const PRESET_COLORS = [
  { label: 'グリーン', value: '#00A650' },
  { label: 'レッド', value: '#BF0000' },
  { label: 'ブルー', value: '#007AFF' },
  { label: 'パープル', value: '#AF52DE' },
  { label: 'ゴールド', value: '#C9A84C' },
  { label: 'チャコール', value: '#3A3A3C' },
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function NewCardScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [cardName, setCardName] = useState('新しいクレジットカード');
  const [last4, setLast4] = useState('0000');
  const [creditLimit, setCreditLimit] = useState(500000);
  const [closingDay, setClosingDay] = useState(15);
  const [paymentDay, setPaymentDay] = useState(10);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].value);

  const previewCard = {
    name: cardName,
    last4,
    balance: 0,
    credit_limit: creditLimit,
    closing_day: closingDay,
    payment_day: paymentDay,
    color: selectedColor,
  };

  const handleSave = () => {
    Alert.alert('登録完了', `${cardName} を追加しました。`, [
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
        <Text style={{ fontSize: 17, fontWeight: '600', color: colors.t1 }}>カードを追加</Text>
        <TouchableOpacity onPress={handleSave} style={{ minWidth: 44, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.blue }}>追加</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.screenPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Preview */}
        <View style={styles.previewContainer}>
          <CreditCardVisual card={previewCard} />
        </View>

        {/* Color picker */}
        <SectionCard header="カラー">
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

        {/* Card details */}
        <SectionCard header="カード情報">
          <TableRow
            title="カード名"
            right={cardName}
            rightColor={colors.t2}
            onPress={() => {}}
          />
          <TableRow
            title="下4桁"
            right={last4}
            rightColor={colors.t2}
            onPress={() => {}}
          />
          <TableRow
            title="限度額"
            right={`¥${creditLimit.toLocaleString()}`}
            rightColor={colors.blue}
            last
            onPress={() => {}}
          />
        </SectionCard>

        {/* Payment schedule */}
        <SectionCard header="支払いサイクル">
          <TableRow
            title="締日"
            right={`毎月 ${closingDay}日`}
            rightColor={colors.t2}
            onPress={() => {}}
          />
          <TableRow
            title="支払日"
            right={`翌月 ${paymentDay}日`}
            rightColor={colors.t2}
            last
            onPress={() => {}}
          />
        </SectionCard>

        {/* Day selector for closing day */}
        <SectionCard header="締日を選択">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexShrink: 0, flexGrow: 0 }}>
            <View style={styles.dayRow}>
              {DAYS.map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setClosingDay(d)}
                  style={[
                    styles.dayPill,
                    {
                      backgroundColor: closingDay === d ? colors.blue : colors.bg2,
                      borderColor: closingDay === d ? colors.blue : colors.sep,
                    },
                  ]}
                >
                  <Text style={[
                    styles.dayText,
                    { color: closingDay === d ? '#FFFFFF' : colors.t2 },
                  ]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SectionCard>

        {/* Day selector for payment day */}
        <SectionCard header="支払日を選択">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexShrink: 0, flexGrow: 0 }}>
            <View style={styles.dayRow}>
              {DAYS.map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setPaymentDay(d)}
                  style={[
                    styles.dayPill,
                    {
                      backgroundColor: paymentDay === d ? colors.green : colors.bg2,
                      borderColor: paymentDay === d ? colors.green : colors.sep,
                    },
                  ]}
                >
                  <Text style={[
                    styles.dayText,
                    { color: paymentDay === d ? '#FFFFFF' : colors.t2 },
                  ]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  previewContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 16,
  },
  colorSwatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  dayRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    paddingHorizontal: 16,
  },
  dayPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
