import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { fontSize, spacing } from '@/theme/tokens';

type Props = {
  title: string;
  subtitle?: string;
  nav?: { onPrev: () => void; onNext: () => void };
};

export function LargeTitle({ title, subtitle, nav }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.t1 }]}>{title}</Text>
      {subtitle != null && (
        <View style={styles.subtitleRow}>
          {nav ? (
            <>
              <TouchableOpacity
                onPress={nav.onPrev}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.arrow}
              >
                <Text style={[styles.arrowText, { color: colors.blue }]}>
                  {'‹'}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.subtitle, { color: colors.t2 }]}>
                {subtitle}
              </Text>
              <TouchableOpacity
                onPress={nav.onNext}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.arrow}
              >
                <Text style={[styles.arrowText, { color: colors.blue }]}>
                  {'›'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={[styles.subtitle, { color: colors.t2 }]}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  subtitle: {
    fontSize: fontSize.caption,
  },
  arrow: {
    paddingHorizontal: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 22,
    fontWeight: '300',
  },
});

export default LargeTitle;
