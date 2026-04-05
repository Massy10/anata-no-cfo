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
          <TouchableOpacity
            style={[
              styles.currencyPill,
              {
                backgroundColor:
                  currency === 'JPY' ? colors.blue + '21' : 'transparent',
                borderColor: currency === 'JPY' ? colors.blue : colors.sep,
              },
            ]}
            onPress={() => setCurrency('JPY')}
          >
            <Text
              style={[
                styles.currencyText,
                { color: currency === 'JPY' ? colors.blue : colors.t2 },
              ]}
            >
              🇯🇵 JPY
            </Text>
          </TouchableOpacity>

          <View style={{ width: 8 }} />

          <TouchableOpacity
            style={[
              styles.currencyPill,
              {
                backgroundColor:
                  currency === 'USD' ? colors.blue + '21' : 'transparent',
                borderColor: currency === 'USD' ? colors.blue : colors.sep,
              },
            ]}
            onPress={() => setCurrency('USD')}
          >
            <Text
              style={[
                styles.currencyText,
                { color: currency === 'USD' ? colors.blue : colors.t2 },
              ]}
            >
              🇺🇸 USD
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form fields */}
        <SectionCard>
          <TableRow icon="💳" title="支払手段" right="三井住友カード" onPress={() => {}} />
          <TableRow icon="🍽" title="用途タグ" right="食費" onPress={() => {}} />
          <TableRow icon="📅" title="日付" right="2026年4月4日" onPress={() => {}} />
          {currency === 'USD' && (
            <TableRow
              icon="📊"
              title="適用レート"
              right={`¥${rate} / USD（自動取得）`}
              rightColor={colors.purple}
            />
          )}
          <TableRow
            icon="📝"
            title="メモ"
            right="タップして入力"
            rightColor={colors.t3}
            last
            onPress={() => {}}
          />
        </SectionCard>

        {/* USD info banner */}
        {currency === 'USD' && (
          <View
            style={[
              styles.infoBanner,
              {
                backgroundColor: colors.purple + '12',
                borderColor: colors.purple + '33',
              },
            ]}
          >
            <Text style={[styles.infoBannerText, { color: colors.purple }]}>
              💱 為替レートは入力日の市場レートを自動取得します。
              手動で変更することも可能です。
            </Text>
          </View>
        )}

        {/* OCR Section */}
        <SectionCard
          header="画像で自動入力"
          footer="金額・日付・用途タグをAIが自動認識します"
        >
          <View style={styles.ocrRow}>
            <TouchableOpacity
              style={[styles.ocrButton, { borderRightWidth: 0.5, borderRightColor: colors.sep }]}
              onPress={() => {}}
            >
              <Text style={[styles.ocrButtonText, { color: colors.blue }]}>
                📷 カメラで撮影
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ocrButton} onPress={() => {}}>
              <Text style={[styles.ocrButtonText, { color: colors.blue }]}>
                🖼 ライブラリから
              </Text>
            </TouchableOpacity>
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
    paddingVertical: 32,
  },
  amountHint: {
    fontSize: fontSize.smallCaption,
    marginBottom: 8,
  },
  amountDisplay: {
    fontSize: fontSize.inputAmount,
    fontWeight: '200',
  },
  conversionPreview: {
    fontSize: 15,
    marginTop: 6,
  },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPaddingH,
    marginBottom: 20,
  },
  currencyPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  currencyText: {
    fontSize: fontSize.body,
    fontWeight: '500',
  },
  infoBanner: {
    marginHorizontal: spacing.screenPaddingH,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.cardPadding,
    marginBottom: spacing.sectionMarginBottom,
  },
  infoBannerText: {
    fontSize: fontSize.caption,
    lineHeight: 20,
  },
  ocrRow: {
    flexDirection: 'row',
    minHeight: 52,
  },
  ocrButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  ocrButtonText: {
    fontSize: fontSize.body,
    fontWeight: '500',
  },
});
