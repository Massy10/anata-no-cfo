import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { radius, fontSize, spacing } from '@/theme/tokens';
import { NavBar } from '@/components/ui/NavBar';
import { SectionCard } from '@/components/ui/SectionCard';
import { TableRow } from '@/components/ui/TableRow';
import { getRate, toJPY } from '@/lib/fx';

export default function NewExpenseScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [currency, setCurrency] = useState<'JPY' | 'USD'>('JPY');
  const [amount, setAmount] = useState('0');

  const numAmount = parseFloat(amount) || 0;
  const rate = getRate();
  const jpyAmt = currency === 'USD' ? toJPY(numAmount, 'USD') : numAmount;
  const sym = currency === 'USD' ? '$' : '¥';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <NavBar
        title="新しい支出"
        onBack={() => router.back()}
        rightAction={{ label: '完了', onPress: () => router.back() }}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.screenPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount display */}
        <View style={styles.amountSection}>
          <Text style={[styles.amountHint, { color: colors.t2 }]}>
            金額をタップして入力
          </Text>
          <Text style={[styles.amountDisplay, { color: colors.red }]}>
            {sym}{numAmount > 0 ? numAmount.toLocaleString() : '0'}
          </Text>
          {currency === 'USD' && numAmount > 0 && (
            <Text style={[styles.conversionPreview, { color: colors.t2 }]}>
              ≒ ¥{jpyAmt.toLocaleString()} (@{rate})
            </Text>
          )}
        </View>

        {/* Currency toggle */}
        <View style={styles.currencyRow}>
          {(['JPY', 'USD'] as const).map((v) => (
            <TouchableOpacity
              key={v}
              style={[
                styles.currencyPill,
                {
                  backgroundColor:
                    currency === v ? colors.blue + '22' : 'transparent',
                  borderColor: currency === v ? colors.blue + '44' : colors.sep,
                },
              ]}
              onPress={() => setCurrency(v)}
            >
              <Text
                style={[
                  styles.currencyText,
                  { color: currency === v ? colors.blue : colors.t3, fontWeight: currency === v ? '600' : '400' },
                ]}
              >
                {v === 'JPY' ? '🇯🇵 JPY' : '🇺🇸 USD'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form fields */}
        <SectionCard>
          {[
            { l: '支払手段', v: '💳 三井住友カード' },
            { l: '用途タグ', v: '🍽 食費' },
            { l: '日付', v: '2026年4月4日' },
            ...(currency === 'USD'
              ? [{ l: '適用レート', v: `¥${rate} / USD（自動取得）` }]
              : []),
            { l: 'メモ', v: 'タップして入力' },
          ].map((f, i, arr) => (
            <TableRow
              key={i}
              title={f.l}
              right={f.v}
              rightColor={f.l === '適用レート' ? colors.purple : colors.t2}
              last={i === arr.length - 1}
              onPress={() => {}}
            />
          ))}
        </SectionCard>

        {/* USD info banner */}
        {currency === 'USD' && (
          <View
            style={[
              styles.infoBanner,
              {
                backgroundColor: colors.purple + '11',
                borderColor: colors.purple + '22',
              },
            ]}
          >
            <Text style={[styles.infoBannerText, { color: colors.purple }]}>
              為替レートは入力日のレートを自動で取得します。
            </Text>
          </View>
        )}

        {/* OCR Section */}
        <SectionCard
          header="画像で自動入力"
          footer="金額・日付・用途タグをAIが自動認識します"
        >
          <View style={styles.ocrRow}>
            {[
              ['📷', 'カメラで撮影'],
              ['🖼', 'ライブラリから'],
            ].map(([ic, lb], i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.ocrHalf,
                  i === 0 && { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.sep },
                ]}
                onPress={() => {}}
              >
                <Text style={styles.ocrIcon}>{ic}</Text>
                <Text style={[styles.ocrLabel, { color: colors.blue }]}>{lb}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  amountSection: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  amountHint: {
    fontSize: 11,
    marginBottom: 4,
  },
  amountDisplay: {
    fontSize: 48,
    fontWeight: '200',
  },
  conversionPreview: {
    fontSize: 15,
    marginTop: 6,
  },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 4,
    paddingBottom: 16,
  },
  currencyPill: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  currencyText: {
    fontSize: 13,
  },
  infoBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  infoBannerText: {
    fontSize: 11,
  },
  ocrRow: {
    flexDirection: 'row',
  },
  ocrHalf: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  ocrIcon: {
    fontSize: 22,
  },
  ocrLabel: {
    fontSize: 13,
    marginTop: 4,
  },
});
