import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';

export function Legend() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={[styles.dot, { backgroundColor: colors.green }]} />
        <Text style={[styles.label, { color: colors.t2 }]}>収入</Text>
      </View>
      <View style={styles.item}>
        <View style={[styles.dot, { backgroundColor: colors.red }]} />
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
    marginTop: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  label: {
    fontSize: 12,
  },
});

export default Legend;
