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
            {cfoName ? `${cfoName}に相談する` : 'CFOに相談する'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.t2 }]}>
            収支データからAIがアドバイス
          </Text>
        </View>

        {/* Right: badge */}
        <View style={[styles.badge, { backgroundColor: colors.blue + '1F' }]}>
          <Text style={[styles.badgeText, { color: colors.blue }]}>
            Free {chatCount}/{chatLimit}回/月
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
  },
  iconCircle: {
    marginRight: 12,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default CfoEntryCard;
