import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { radius } from '@/theme/tokens';

let BlurView: React.ComponentType<any> | null = null;
try {
  BlurView = require('expo-blur').BlurView;
} catch {
  BlurView = null;
}

type Props = {
  onPress: () => void;
  cfoName?: string;
  chatCount?: number;
  chatLimit?: number;
};

export function CfoEntryCard({
  onPress,
  cfoName,
  chatCount = 0,
  chatLimit = 10,
}: Props) {
  const { colors } = useTheme();

  const inner = (
    <>
      {/* Decorative purple bubble */}
      <View
        style={[
          styles.decorBubble,
          { backgroundColor: colors.purple, opacity: 0.08 },
        ]}
      />

      <View style={styles.row}>
        {/* Left: gradient circle with emoji */}
        <View style={styles.iconCircle}>
          <View
            style={[
              styles.iconGradient,
              { backgroundColor: colors.blue },
            ]}
          >
            <View
              style={[
                styles.iconOverlay,
                { backgroundColor: colors.purple, opacity: 0.5 },
              ]}
            />
            <Text style={styles.iconEmoji}>{'🧠'}</Text>
          </View>
        </View>

        {/* Center: title + subtitle */}
        <View style={styles.center}>
          <Text style={[styles.title, { color: colors.t1 }]}>
            {'CFOに相談する'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.t2 }]}>
            収支データからAIがアドバイス
          </Text>
        </View>

        {/* Right: badge */}
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.blue + '12',
              borderWidth: 0.5,
              borderColor: colors.blue + '22',
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: colors.blue }]}>
            Free 30回/月
          </Text>
        </View>
      </View>
    </>
  );

  const containerStyle = [
    styles.container,
    { borderColor: colors.heroBorder as string },
  ];

  if (BlurView && Platform.OS === 'ios') {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <View style={containerStyle}>
          <BlurView intensity={12} tint="default" style={StyleSheet.absoluteFill} />
          <View style={styles.innerPad}>{inner}</View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View
        style={[containerStyle, { backgroundColor: colors.heroGlass as string }]}
      >
        {inner}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: radius.hero,
    borderWidth: 0.5,
    padding: 18,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 2,
  },
  innerPad: {
    padding: 18,
  },
  decorBubble: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    flexShrink: 0,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  iconEmoji: {
    fontSize: 24,
    zIndex: 1,
  },
  center: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 3,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default CfoEntryCard;
