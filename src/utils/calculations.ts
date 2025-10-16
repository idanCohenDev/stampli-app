import { Expense, ExpenseSummary, ExpenseCategory } from '@/src/types';

export const calculateSummary = (expenses: Expense[]): ExpenseSummary => {
  const totalSpend = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const transactionCount = expenses.length;
  const averageTransaction = transactionCount > 0 ? totalSpend / transactionCount : 0;

  const spendByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  return {
    totalSpend,
    transactionCount,
    averageTransaction,
    spendByCategory,
  };
};

export const groupExpensesByCategory = (expenses: Expense[]): Record<ExpenseCategory, Expense[]> => {
  return expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {} as Record<ExpenseCategory, Expense[]>);
};

export const sortExpensesByDate = (expenses: Expense[], ascending: boolean = false): Expense[] => {
  return [...expenses].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};
