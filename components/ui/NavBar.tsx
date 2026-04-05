import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme/useTheme';
import { fontSize } from '@/theme/tokens';

type Props = {
  title: string;
  onBack: () => void;
  rightAction?: { label: string; onPress: () => void };
};

export function NavBar({ title, onBack, rightAction }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: colors.sep }]}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Svg width={10} height={18} viewBox="0 0 10 18" fill="none">
          <Path
            d="M9 1L1 9L9 17"
            stroke={colors.blue}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <Text style={[styles.backText, { color: colors.blue }]}>戻る</Text>
      </TouchableOpacity>

      <Text
        style={[styles.title, { color: colors.t1 }]}
        numberOfLines={1}
      >
        {title}
      </Text>

      {rightAction ? (
        <TouchableOpacity
          onPress={rightAction.onPress}
          style={styles.rightButton}
        >
          <Text style={[styles.rightText, { color: colors.blue }]}>
            {rightAction.label}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.rightPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    minWidth: 60,
  },
  backText: {
    fontSize: fontSize.body,
    marginLeft: 6,
  },
  title: {
    fontSize: fontSize.body,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  rightButton: {
    minHeight: 44,
    minWidth: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightText: {
    fontSize: fontSize.body,
  },
  rightPlaceholder: {
    minWidth: 60,
  },
});

export default NavBar;
