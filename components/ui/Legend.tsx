import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { fontSize } from '@/theme/tokens';

export function Legend() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={[styles.dot, { backgroundColor: colors.blue, opacity: 0.8 }]} />
        <Text style={[styles.label, { color: colors.t2 }]}>収入</Text>
      </View>
      <View style={styles.item}>
        <View style={[styles.dot, { backgroundColor: colors.red, opacity: 0.8 }]} />
        <Text style={[styles.label, { color: colors.t2 }]}>支出</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  label: {
    fontSize: fontSize.caption,
  },
});

export default Legend;
