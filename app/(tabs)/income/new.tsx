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
import { spacing } from '@/theme/tokens';
import { NavBar } from '@/components/ui/NavBar';
import { SectionCard } from '@/components/ui/SectionCard';
import { TableRow } from '@/components/ui/TableRow';
import { getRate, toJPY } from '@/lib/fx';

export default function NewIncomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [currency, setCurrency] = useState<'JPY' | 'USD'>('JPY');
  const [amount, setAmount] = useState('0');

  const numAmount = parseFloat(amount) || 0;
  const rate = getRate('4月4日');
  const jpyAmt = currency === 'USD' ? Math.round(numAmount * rate) : numAmount;
  const sym = currency === 'USD' ? '$' : '¥';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <NavBar
        title="新しい収入"
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
          <Text style={[styles.amountDisplay, { color: colors.green }]}>
            {sym}{numAmount.toLocaleString()}
          </Text>
          {currency === 'USD' && numAmount > 0 && (
            <Text style={[styles.conversionPreview, { color: colors.t2 }]}>
              ≒ ¥{jpyAmt.toLocaleString()}{' '}
              <Text style={{ fontSize: 11, color: colors.t3 }}>(@{rate})</Text>
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
                style={[
                  styles.currencyPill,
                  {
                    backgroundColor: active ? `${colors.blue}22` : 'transparent',
                    borderColor: active ? `${colors.blue}44` : colors.sep,
                    borderWidth: 0.5,
                  },
                ]}
                onPress={() => setCurrency(v)}
              >
                <Text
                  style={[
                    styles.currencyText,
                    {
                      color: active ? colors.blue : colors.t3,
                      fontWeight: active ? '600' : '400',
                    },
                  ]}
                >
                  {v === 'JPY' ? '🇯🇵 JPY' : '🇺🇸 USD'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Form fields */}
        <SectionCard>
          {[
            { l: '受取方法', v: '🏦 銀行振込' },
            { l: 'カテゴリ', v: '💼 副業収入' },
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
                backgroundColor: `${colors.purple}11`,
                borderColor: `${colors.purple}22`,
              },
            ]}
          >
            <Text style={[styles.infoBannerText, { color: colors.purple }]}>
              為替レートは入力日のレートを自動で取得します。保存後の円換算額は ¥{jpyAmt.toLocaleString()} です。
            </Text>
          </View>
        )}
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
    marginTop: 2,
  },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 4,
    paddingBottom: 16,
  },
  currencyPill: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  currencyText: {
    fontSize: 13,
  },
  infoBanner: {
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  infoBannerText: {
    fontSize: 11,
  },
});
