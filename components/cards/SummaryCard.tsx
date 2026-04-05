import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { radius } from '@/theme/tokens';

type Props = {
  label: string;
  value: string;
  color: string;
  variant?: 'outline' | 'filled';
};

export function SummaryCard({ label, value, color, variant = 'filled' }: Props) {
  const { colors } = useTheme();

  const isOutline = variant === 'outline';

  return (
    <View
      style={[
        styles.card,
        isOutline
          ? {
              backgroundColor: color + '10',
              borderWidth: 0.5,
              borderColor: color + '22',
              borderRadius: 10,
            }
          : { backgroundColor: colors.bg2 },
      ]}
    >
      <Text style={[styles.label, { color }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.t1 }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.card,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    fontWeight: '300',
    marginTop: 2,
  },
});

export default SummaryCard;
