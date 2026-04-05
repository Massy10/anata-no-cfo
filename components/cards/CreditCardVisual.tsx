import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';

type CardData = {
  name: string;
  last4: string;
  balance: number;
  credit_limit: number;
  closing_day: number;
  payment_day: number;
  color: string;
};

type Props = {
  card: CardData;
};

function formatAmount(n: number): string {
  return '¥' + n.toLocaleString();
}

export function CreditCardVisual({ card }: Props) {
  const { colors } = useTheme();
  const bgPrimary = card.color + 'CC';
  const bgSecondary = card.color + '77';

  return (
    <View style={[styles.card, { backgroundColor: bgPrimary }]}>
      {/* Decorative circles */}
      <View style={styles.decorTopRight} />
      <View style={styles.decorBottomLeft} />
      <View style={styles.decorMidRight} />

      {/* Card name */}
      <Text style={styles.cardName}>{card.name}</Text>

      {/* Card number */}
      <Text style={styles.cardNumber}>
        {'•••• •••• •••• ' + card.last4}
      </Text>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.label}>利用額</Text>
          <Text style={styles.amount}>{formatAmount(card.balance)}</Text>
        </View>
        <View style={styles.rightInfo}>
          <Text style={styles.label}>
            締日 {card.closing_day}日 / 支払日 {card.payment_day}日
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 180,
  },
  decorTopRight: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  decorBottomLeft: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  decorMidRight: {
    position: 'absolute',
    top: '50%',
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  cardName: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.73)',
    marginBottom: 20,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 4,
    color: '#FFFFFF',
    marginBottom: 24,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rightInfo: {
    alignItems: 'flex-end',
  },
});

export default CreditCardVisual;
