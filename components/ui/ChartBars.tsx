import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';

type BarData = {
  m: string;
  inc: number;
  exp: number;
};

type Props = {
  data: BarData[];
  dashed?: boolean;
  count?: number;
  barWidth?: number;
};

const MAX_BAR_HEIGHT = 90;

export function ChartBars({ data, dashed = false, count, barWidth = 14 }: Props) {
  const { colors } = useTheme();
  const displayData = count != null ? data.slice(0, count) : data;

  const maxVal = Math.max(
    ...displayData.map((d) => Math.max(d.inc, d.exp)),
    1,
  );

  const barHeight = (val: number) =>
    Math.max((val / maxVal) * MAX_BAR_HEIGHT, 2);

  const formatNet = (val: number) => {
    const prefix = val >= 0 ? '+' : '';
    return prefix + Math.round(val / 10000) + '万';
  };

  return (
    <View style={styles.container}>
      {displayData.map((d, i) => {
        const net = d.inc - d.exp;
        const netColor = net >= 0 ? colors.green : colors.red;

        return (
          <View key={i} style={styles.column}>
            <Text style={[styles.netLabel, { color: netColor }]}>
              {formatNet(net)}
            </Text>
            <View style={styles.barPair}>
              <View
                style={[
                  styles.bar,
                  {
                    width: barWidth,
                    height: barHeight(d.inc),
                    backgroundColor: dashed ? colors.green + '30' : colors.green + 'CC',
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  },
                  dashed && {
                    borderWidth: 1,
                    borderStyle: 'dashed' as const,
                    borderColor: colors.green + '66',
                    backgroundColor: 'transparent',
                  },
                ]}
              />
              <View
                style={[
                  styles.bar,
                  {
                    width: barWidth,
                    height: barHeight(d.exp),
                    backgroundColor: dashed ? colors.red + '25' : colors.red + 'AA',
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  },
                  dashed && {
                    borderWidth: 1,
                    borderStyle: 'dashed' as const,
                    borderColor: colors.red + '55',
                    backgroundColor: 'transparent',
                  },
                ]}
              />
            </View>
            <Text style={[styles.monthLabel, { color: colors.t3 }]}>
              {d.m}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 130,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    paddingHorizontal: 4,
  },
  column: {
    alignItems: 'center',
    flex: 1,
  },
  netLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 3,
  },
  barPair: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: MAX_BAR_HEIGHT,
  },
  bar: {
    minHeight: 2,
  },
  monthLabel: {
    fontSize: 10,
    marginTop: 4,
  },
});

export default ChartBars;
