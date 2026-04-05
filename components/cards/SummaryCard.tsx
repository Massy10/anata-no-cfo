import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';

type Props = {
  label: string;
  value: string;
  color: string;
};

/**
 * 数値サマリーカード。1色 = 1意味。
 * variant 分岐を廃止し、全て同じスタイルに統一。
 */
export function SummaryCard({ label, value, color }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.bg2 }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.t1 }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  value: {
    fontSize: 17,
    fontWeight: '500',
    marginTop: 3,
  },
});

export default SummaryCard;
