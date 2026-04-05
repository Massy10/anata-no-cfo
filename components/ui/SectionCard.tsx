import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { radius, fontSize } from '@/theme/tokens';

type Props = {
  header?: string;
  footer?: string;
  children: React.ReactNode;
};

export function SectionCard({ header, footer, children }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.outer}>
      {header != null && (
        <Text style={[styles.header, { color: colors.t2 }]}>{header}</Text>
      )}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.bg2,
            shadowColor: colors.cardShadow as string,
          },
        ]}
      >
        {children}
      </View>
      {footer != null && (
        <Text style={[styles.footer, { color: colors.t2 }]}>{footer}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  header: {
    fontSize: fontSize.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 6,
  },
  card: {
    borderRadius: radius.card,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  footer: {
    fontSize: fontSize.caption,
    paddingHorizontal: 4,
    paddingTop: 6,
  },
});

export default SectionCard;
