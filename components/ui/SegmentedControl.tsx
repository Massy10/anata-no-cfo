import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { fontSize } from '@/theme/tokens';

type Props = {
  options: [string, string][];
  active: string;
  onChange: (key: string) => void;
};

export function SegmentedControl({ options, active, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.fill }]}
    >
      {options.map(([key, label]) => {
        const isActive = key === active;
        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.segment,
              isActive && [styles.activeSegment, { backgroundColor: colors.bg }],
            ]}
            activeOpacity={0.7}
            onPress={() => onChange(key)}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.t1 : colors.t2 },
                isActive && styles.activeLabel,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 2,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  segment: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  activeSegment: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: fontSize.caption,
    fontWeight: '400',
    textAlign: 'center',
  },
  activeLabel: {
    fontWeight: '600',
  },
});

export default SegmentedControl;
