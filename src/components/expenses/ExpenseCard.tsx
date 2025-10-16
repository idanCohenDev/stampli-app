import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Expense } from '@/src/types';
import { formatCurrency, formatRelativeTime, getCategoryColor } from '@/src/utils';

interface ExpenseCardProps {
  expense: Expense;
}

export const ExpenseCard = React.memo<ExpenseCardProps>(({ expense }) => {
  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(expense.category) }]}>
          <Text style={styles.categoryText}>{expense.category}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.merchant}>{expense.merchant}</Text>
          <Text style={styles.date}>{formatRelativeTime(expense.date)}</Text>
        </View>
      </View>
      <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  details: {
    flex: 1,
  },
  merchant: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#718096',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
});
