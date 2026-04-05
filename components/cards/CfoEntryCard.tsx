import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import Svg, { Path } from 'react-native-svg';

type Props = {
  onPress: () => void;
  cfoName?: string;
  chatCount?: number;
  chatLimit?: number;
};

/**
 * CFOチャットへの導線。
 * HeroCardではなく、リスト内の1行として自然に配置する。
 */
export function CfoEntryCard({ onPress, cfoName, chatCount = 0, chatLimit = 30 }: Props) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[styles.container, { backgroundColor: colors.bg2 }]}
    >
      <View style={[styles.icon, { backgroundColor: colors.blue + '14' }]}>
        <Text style={styles.iconEmoji}>🧠</Text>
      </View>

      <View style={styles.center}>
        <Text style={[styles.title, { color: colors.t1 }]}>CFOに相談する</Text>
        <Text style={[styles.subtitle, { color: colors.t2 }]}>
          収支データからアドバイス
        </Text>
      </View>

      <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
        <Path
          d="M1 1L7 7L1 13"
          stroke={colors.t3}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 20,
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
    marginTop: 2,
  },
});

export default CfoEntryCard;
