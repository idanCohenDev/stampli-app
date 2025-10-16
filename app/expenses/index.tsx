import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useExpenses, useAddExpense, useFlushQueue, expenseService } from '@/src/state';
import { netInfoService, pushService } from '@/src/services';
import {
  AddExpenseForm,
  ExpenseList,
  SummaryHeader,
  OfflineBanner,
} from '@/src/components/expenses';
import { calculateSummary, sortExpensesByDate } from '@/src/utils';
import { Expense } from '@/src/types';

export default function ExpensesScreen() {
  const [isOnline, setIsOnline] = useState(true);
  const [queueLength, setQueueLength] = useState(0);

  const { data: expenses = [], isLoading } = useExpenses();
  const addExpenseMutation = useAddExpense();
  const flushQueueMutation = useFlushQueue();

  useEffect(() => {
    const unsubscribe = netInfoService.onConnectionChange((isConnected) => {
      setIsOnline(isConnected);

      if (isConnected) {
        flushQueueMutation.mutate();
      }
    });

    setIsOnline(netInfoService.getConnectionStatus());

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Request notification permissions on mount
    pushService.requestPermissions();
  }, []);

  useEffect(() => {
    setQueueLength(expenseService.getQueueLength());
  }, [expenses]);

  useEffect(() => {
    const unsubscribe = pushService.onPushReceived((expense: Expense) => {
      Alert.alert(
        'New Expense!',
        `${expense.merchant} - $${expense.amount.toFixed(2)}`,
        [{ text: 'OK' }]
      );
    });

    return unsubscribe;
  }, []);

  const handleSimulatePush = async () => {
    await pushService.simulatePushNotification();
  };

  const sortedExpenses = sortExpensesByDate(expenses);
  const summary = calculateSummary(expenses);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Expenses</Text>
          <TouchableOpacity style={styles.pushButton} onPress={handleSimulatePush}>
            <Text style={styles.pushButtonText}>Simulate Push</Text>
          </TouchableOpacity>
        </View>

        <OfflineBanner isVisible={!isOnline} queueLength={queueLength} />

        <SummaryHeader summary={summary} />

        <AddExpenseForm
          onSubmit={addExpenseMutation.mutate}
          isLoading={addExpenseMutation.isPending}
        />

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Recent Transactions</Text>
          <Text style={styles.listCount}>{expenses.length} total</Text>
        </View>

        <ExpenseList expenses={sortedExpenses} isLoading={isLoading} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D3748',
  },
  pushButton: {
    backgroundColor: '#805AD5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pushButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  listCount: {
    fontSize: 14,
    color: '#718096',
  },
});
