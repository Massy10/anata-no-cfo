import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

let LinearGradient: React.ComponentType<any> | null = null;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch {
  LinearGradient = null;
}

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

/**
 * クレジットカードのビジュアル表現。
 * 装飾的な円を廃止。色のグラデーションと情報のみで構成。
 */
export function CreditCardVisual({ card }: Props) {
  const cardContent = (
    <>
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
          <Text style={styles.label}>締日 / 支払日</Text>
          <Text style={styles.dateText}>
            {card.closing_day}日 / {card.payment_day}日
          </Text>
        </View>
      </View>
    </>
  );

  if (LinearGradient) {
    return (
      <LinearGradient
        colors={[card.color, card.color + 'AA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {cardContent}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: card.color }]}>
      {cardContent}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 20,
    overflow: 'hidden',
  },
  cardName: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 14,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 3,
    color: '#FFFFFF',
    marginBottom: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 2,
  },
  amount: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  rightInfo: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
  },
});

export default CreditCardVisual;
