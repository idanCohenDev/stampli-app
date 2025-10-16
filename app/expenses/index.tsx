import { AddExpenseForm, ExpenseList, OfflineBanner, SummaryHeader } from "@/src/components/expenses";
import { APP_CONFIG } from "@/src/constants";
import { useExpenseQueue, useNetworkStatus, usePushNotifications } from "@/src/hooks";
import { useAddExpense, useExpenses } from "@/src/state";
import { calculateSummary, sortExpensesByDate } from "@/src/utils";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ExpensesScreen() {
  const { data: expenses = [], isLoading } = useExpenses();
  const addExpenseMutation = useAddExpense();

  const { isOnline } = useNetworkStatus();
  const { queueLength } = useExpenseQueue(expenses, isOnline);
  const { simulatePush } = usePushNotifications();

  const sortedExpenses = sortExpensesByDate(expenses);
  const summary = calculateSummary(expenses);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Expenses</Text>
          {APP_CONFIG.ENABLE_PUSH_SIMULATION && (
            <TouchableOpacity style={styles.pushButton} onPress={simulatePush}>
              <Text style={styles.pushButtonText}>Simulate Push</Text>
            </TouchableOpacity>
          )}
        </View>

        <OfflineBanner isVisible={!isOnline} queueLength={queueLength} />

        <SummaryHeader summary={summary} />

        <AddExpenseForm onSubmit={addExpenseMutation.mutate} isLoading={addExpenseMutation.isPending} />

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
    backgroundColor: "#F7FAFC",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2D3748",
  },
  pushButton: {
    backgroundColor: "#805AD5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pushButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
  },
  listCount: {
    fontSize: 14,
    color: "#718096",
  },
});
