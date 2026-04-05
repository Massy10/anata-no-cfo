import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';

type Props = {
  children: React.ReactNode;
  variant?: 'positive' | 'negative';
};

/**
 * 画面の主役数値を表示するカード。
 * 装飾は排除。variant で背景のトーンだけ変える。
 */
export function HeroCard({ children, variant = 'positive' }: Props) {
  const { colors } = useTheme();
  const accent = variant === 'positive' ? colors.green : colors.red;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: accent + '08',
          borderColor: accent + '15',
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
});

export default HeroCard;
