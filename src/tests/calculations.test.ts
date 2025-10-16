import { calculateSummary, sortExpensesByDate } from '@/src/utils/calculations';
import { Expense, ExpenseCategory } from '@/src/types';

describe('calculations', () => {
  const mockExpenses: Expense[] = [
    {
      id: '1',
      merchant: 'Store A',
      amount: 100,
      category: ExpenseCategory.FOOD,
      date: '2025-10-15T10:00:00Z',
      createdAt: '2025-10-15T10:00:00Z',
    },
    {
      id: '2',
      merchant: 'Store B',
      amount: 50,
      category: ExpenseCategory.TRANSPORT,
      date: '2025-10-14T10:00:00Z',
      createdAt: '2025-10-14T10:00:00Z',
    },
    {
      id: '3',
      merchant: 'Store C',
      amount: 75,
      category: ExpenseCategory.FOOD,
      date: '2025-10-16T10:00:00Z',
      createdAt: '2025-10-16T10:00:00Z',
    },
  ];

  describe('calculateSummary', () => {
    it('should calculate correct summary', () => {
      const summary = calculateSummary(mockExpenses);

      expect(summary.totalSpend).toBe(225);
      expect(summary.transactionCount).toBe(3);
      expect(summary.averageTransaction).toBe(75);
      expect(summary.spendByCategory[ExpenseCategory.FOOD]).toBe(175);
      expect(summary.spendByCategory[ExpenseCategory.TRANSPORT]).toBe(50);
    });

    it('should handle empty array', () => {
      const summary = calculateSummary([]);

      expect(summary.totalSpend).toBe(0);
      expect(summary.transactionCount).toBe(0);
      expect(summary.averageTransaction).toBe(0);
    });
  });

  describe('sortExpensesByDate', () => {
    it('should sort expenses by date descending by default', () => {
      const sorted = sortExpensesByDate(mockExpenses);

      expect(sorted[0].id).toBe('3');
      expect(sorted[1].id).toBe('1');
      expect(sorted[2].id).toBe('2');
    });

    it('should sort expenses by date ascending when specified', () => {
      const sorted = sortExpensesByDate(mockExpenses, true);

      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('1');
      expect(sorted[2].id).toBe('3');
    });
  });
});
