import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
            { backgroundColor: iconBg ?? colors.bg3 },
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
          {badge != null && badgeColor != null && (
            <View
              style={[
                styles.badge,
                { backgroundColor: badgeColor + '21' },
              ]}
            >
              <Text style={[styles.badgeText, { color: badgeColor }]}>
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
        <Text style={[styles.chevron, { color: colors.t3 }]}>{'›'}</Text>
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
    paddingVertical: 8,
  },
  iconBox: {
    width: spacing.rowIconSize,
    height: spacing.rowIconSize,
    borderRadius: radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.body,
    fontWeight: '400',
  },
  badge: {
    borderRadius: radius.badge,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: fontSize.smallCaption,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginLeft: 8,
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
    fontSize: 20,
    fontWeight: '300',
    marginLeft: 4,
  },
});

export default TableRow;
