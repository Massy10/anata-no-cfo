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
        <Text style={[styles.footer, { color: colors.t3 }]}>{footer}</Text>
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
    fontWeight: '500',
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 6,
  },
  card: {
    borderRadius: radius.card,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  },
  footer: {
    fontSize: 12,
    fontWeight: '400',
    paddingHorizontal: 4,
    paddingTop: 5,
  },
});

export default SectionCard;
