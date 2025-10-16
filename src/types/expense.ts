export enum ExpenseCategory {
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  ENTERTAINMENT = 'Entertainment',
  UTILITIES = 'Utilities',
  SHOPPING = 'Shopping',
  HEALTHCARE = 'Healthcare',
  OTHER = 'Other',
}

export interface Expense {
  id: string;
  merchant: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  createdAt: string;
}

export interface NewExpense {
  merchant: string;
  amount: number;
  category: ExpenseCategory;
  date?: string;
}

export interface ExpenseSummary {
  totalSpend: number;
  transactionCount: number;
  averageTransaction: number;
  spendByCategory: Record<ExpenseCategory, number>;
}

export interface QueuedExpense {
  tempId: string;
  expense: NewExpense;
  timestamp: number;
}
