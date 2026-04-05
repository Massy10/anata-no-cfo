import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { radius } from '@/theme/tokens';

let BlurView: React.ComponentType<any> | null = null;
try {
  BlurView = require('expo-blur').BlurView;
} catch {
  BlurView = null;
}

type Props = {
  children: React.ReactNode;
  variant?: 'positive' | 'negative';
};

export function HeroCard({ children, variant = 'positive' }: Props) {
  const { colors } = useTheme();
  const accentColor = variant === 'positive' ? colors.green : colors.red;

  const inner = (
    <>
      <View
        style={[
          styles.decorCircleTopRight,
          { backgroundColor: accentColor, opacity: 0.12 },
        ]}
      />
      <View
        style={[
          styles.decorCircleBottomLeft,
          { backgroundColor: accentColor, opacity: 0.08 },
        ]}
      />
      {children}
    </>
  );

  const containerStyle = [
    styles.container,
    {
      borderColor: colors.heroBorder as string,
    },
  ];

  if (BlurView && Platform.OS === 'ios') {
    return (
      <View style={containerStyle}>
        <BlurView intensity={12} tint="default" style={StyleSheet.absoluteFill} />
        <View style={styles.contentWrap}>{inner}</View>
      </View>
    );
  }

  return (
    <View style={[containerStyle, { backgroundColor: colors.heroGlass as string }]}>
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 20,
    paddingHorizontal: 16,
    borderRadius: radius.hero,
    borderWidth: 0.5,
    overflow: 'hidden',
    position: 'relative',
  },
  contentWrap: {
    padding: 20,
    paddingHorizontal: 16,
  },
  decorCircleTopRight: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  decorCircleBottomLeft: {
    position: 'absolute',
    bottom: -15,
    left: -15,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default HeroCard;
