import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme/useTheme';
import { radius, fontSize, spacing } from '@/theme/tokens';

type Props = {
  icon?: string;
  iconBg?: string;
  title: string;
  subtitle?: string;
  right?: string;
  rightColor?: string;
  badge?: string;
  badgeColor?: string;
  rightSub?: string;
  last?: boolean;
  onPress?: () => void;
};

export function TableRow({
  icon,
  iconBg,
  title,
  subtitle,
  right,
  rightColor,
  badge,
  badgeColor,
  rightSub,
  last,
  onPress,
}: Props) {
  const { colors } = useTheme();

  const content = (
    <View
      style={[
        styles.row,
        !last && { borderBottomWidth: 0.5, borderBottomColor: colors.sep },
      ]}
    >
      {icon != null && (
        <View
          style={[
            styles.iconBox,
            { backgroundColor: iconBg ?? colors.fill },
          ]}
        >
          <Text style={styles.iconEmoji}>{icon}</Text>
        </View>
      )}

      <View style={styles.center}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.t1 }]} numberOfLines={1}>
            {title}
          </Text>
          {badge != null && (
            <View
              style={[
                styles.badge,
                { backgroundColor: (badgeColor ?? colors.cyan) + '22' },
              ]}
            >
              <Text style={[styles.badgeText, { color: badgeColor ?? colors.cyan }]}>
                {badge}
              </Text>
            </View>
          )}
        </View>
        {subtitle != null && (
          <Text style={[styles.subtitle, { color: colors.t2 }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {right != null && (
          <Text
            style={[
              styles.rightText,
              { color: rightColor ?? colors.t1 },
            ]}
            numberOfLines={1}
          >
            {right}
          </Text>
        )}
        {rightSub != null && (
          <Text style={[styles.rightSub, { color: colors.t2 }]}>
            {rightSub}
          </Text>
        )}
      </View>

      {onPress != null && (
        <Svg width={8} height={14} viewBox="0 0 8 14" fill="none" style={styles.chevron}>
          <Path
            d="M1 1L7 7L1 13"
            stroke={colors.t3}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: spacing.rowMinHeight,
    paddingHorizontal: 16,
  },
  iconBox: {
    width: spacing.rowIconSize,
    height: spacing.rowIconSize,
    borderRadius: radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  iconEmoji: {
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: fontSize.body,
    fontWeight: '400',
  },
  badge: {
    borderRadius: radius.badge,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: fontSize.smallCaption,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: fontSize.caption,
    marginTop: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginLeft: 8,
    flexShrink: 0,
  },
  rightText: {
    fontSize: fontSize.body,
    fontWeight: '400',
  },
  rightSub: {
    fontSize: fontSize.smallCaption,
    marginTop: 1,
  },
  chevron: {
    marginLeft: 6,
    flexShrink: 0,
  },
});

export default TableRow;
