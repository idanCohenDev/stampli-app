import React from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import { Expense } from '@/src/types';
import { ExpenseCard } from './ExpenseCard';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading?: boolean;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, isLoading = false }) => {
  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading expenses...</Text>
      </View>
    );
  }

  if (expenses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No expenses yet</Text>
        <Text style={styles.emptySubtext}>Add your first expense to get started</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={expenses}
      renderItem={({ item }) => <ExpenseCard expense={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#718096',
  },
});
