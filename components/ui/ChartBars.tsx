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

const MAX_BAR_HEIGHT = 100;

export function ChartBars({ data, dashed = false, count, barWidth = 12 }: Props) {
  const { colors } = useTheme();
  const displayData = count != null ? data.slice(0, count) : data;

  const maxVal = Math.max(
    ...displayData.map((d) => Math.max(d.inc, d.exp)),
    1,
  );

  const barHeight = (val: number) =>
    Math.max((val / maxVal) * MAX_BAR_HEIGHT, 2);

  const formatMan = (val: number) => {
    const man = val / 10000;
    if (man >= 10) return Math.round(man) + '万';
    return man.toFixed(1) + '万';
  };

  return (
    <View style={styles.container}>
      {displayData.map((d, i) => {
        const net = d.inc - d.exp;
        const netColor = net >= 0 ? colors.green : colors.red;

        return (
          <View key={i} style={styles.column}>
            <Text style={[styles.netLabel, { color: netColor }]}>
              {net >= 0 ? '+' : ''}
              {formatMan(net)}
            </Text>
            <View style={styles.barPair}>
              <View
                style={[
                  styles.bar,
                  {
                    width: barWidth,
                    height: barHeight(d.inc),
                    backgroundColor: colors.blue,
                    opacity: dashed ? 0.4 : 1,
                    borderRadius: 3,
                  },
                  dashed && styles.dashedBar,
                ]}
              />
              <View
                style={[
                  styles.bar,
                  {
                    width: barWidth,
                    height: barHeight(d.exp),
                    backgroundColor: colors.red,
                    opacity: dashed ? 0.4 : 1,
                    borderRadius: 3,
                  },
                  dashed && styles.dashedBar,
                ]}
              />
            </View>
            <Text style={[styles.monthLabel, { color: colors.t2 }]}>
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
    height: 140,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    paddingHorizontal: 4,
  },
  column: {
    alignItems: 'center',
    flex: 1,
  },
  netLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },
  barPair: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bar: {
    minHeight: 2,
  },
  dashedBar: {
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  monthLabel: {
    fontSize: 10,
    marginTop: 4,
  },
});

export default ChartBars;
