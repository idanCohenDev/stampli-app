import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExpenseService } from '@/src/services/ExpenseService';
import { ApiClient } from '@/src/services/ApiClient';
import { ExpenseCategory } from '@/src/types';

jest.mock('@/src/services/ApiClient');

describe('ExpenseService', () => {
  let expenseService: ExpenseService;
  let mockApiClient: jest.Mocked<ApiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();

    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
    } as any;

    expenseService = new ExpenseService(mockApiClient);
  });

  describe('addTransaction', () => {
    it('should add expense to queue when offline', async () => {
      mockApiClient.post.mockResolvedValue({
        success: false,
        data: null,
        error: { message: 'Network error' },
      });

      const newExpense = {
        merchant: 'Test Store',
        amount: 50.0,
        category: ExpenseCategory.FOOD,
      };

      const result = await expenseService.addTransaction(newExpense);

      expect(result.merchant).toBe('Test Store');
      expect(result.amount).toBe(50.0);
      expect(expenseService.getQueueLength()).toBe(1);
    });

    it('should return expense immediately when online', async () => {
      const mockExpense = {
        id: '123',
        merchant: 'Test Store',
        amount: 50.0,
        category: ExpenseCategory.FOOD,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      mockApiClient.post.mockResolvedValue({
        success: true,
        data: mockExpense,
      });

      const result = await expenseService.addTransaction({
        merchant: 'Test Store',
        amount: 50.0,
        category: ExpenseCategory.FOOD,
      });

      expect(result.id).toBe('123');
      expect(expenseService.getQueueLength()).toBe(0);
    });
  });

  describe('flushQueue', () => {
    it('should flush queued expenses when back online', async () => {
      mockApiClient.post
        .mockResolvedValueOnce({
          success: false,
          data: null,
          error: { message: 'Network error' },
        })
        .mockResolvedValueOnce({
          success: true,
          data: {
            id: '123',
            merchant: 'Test Store',
            amount: 50.0,
            category: ExpenseCategory.FOOD,
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
        });

      await expenseService.addTransaction({
        merchant: 'Test Store',
        amount: 50.0,
        category: ExpenseCategory.FOOD,
      });

      expect(expenseService.getQueueLength()).toBe(1);

      await expenseService.flushQueue();

      expect(expenseService.getQueueLength()).toBe(0);
    });
  });
});
