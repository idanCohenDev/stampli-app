import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ExpenseSummary } from '@/src/types';
import { formatCurrency, getCategoryColor } from '@/src/utils';

interface SummaryHeaderProps {
  summary: ExpenseSummary;
}

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({ summary }) => {
  return (
    <View style={styles.container}>
      <View style={styles.mainStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Spend</Text>
          <Text style={styles.statValue}>{formatCurrency(summary.totalSpend)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Transactions</Text>
          <Text style={styles.statValue}>{summary.transactionCount}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>{formatCurrency(summary.averageTransaction)}</Text>
        </View>
      </View>

      <View style={styles.categoryBreakdown}>
        <Text style={styles.breakdownTitle}>Spend by Category</Text>
        <View style={styles.categoriesGrid}>
          {Object.entries(summary.spendByCategory).map(([category, amount]) => (
            <View key={category} style={styles.categoryItem}>
              <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(category as any) }]} />
              <Text style={styles.categoryLabel}>{category}</Text>
              <Text style={styles.categoryAmount}>{formatCurrency(amount)}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  mainStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  categoryBreakdown: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 20,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryLabel: {
    flex: 1,
    fontSize: 14,
    color: '#4A5568',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
});
