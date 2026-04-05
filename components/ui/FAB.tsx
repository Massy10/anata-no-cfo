import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { useTheme } from '@/theme/useTheme';
import { radius, spacing } from '@/theme/tokens';

type Props = {
  onPress: () => void;
  color: string;
};

export function FAB({ onPress, color }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.fab,
        {
          backgroundColor: color,
          shadowColor: color,
        },
      ]}
    >
      <Svg width={24} height={24} viewBox="0 0 24 24">
        <Line
          x1={12}
          y1={4}
          x2={12}
          y2={20}
          stroke="#FFFFFF"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <Line
          x1={4}
          y1={12}
          x2={20}
          y2={12}
          stroke="#FFFFFF"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: spacing.fabBottom,
    width: spacing.fabSize,
    height: spacing.fabSize,
    borderRadius: radius.fab,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.33,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 10,
  },
});

export default FAB;
