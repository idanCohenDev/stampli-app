import { Expense, ExpenseCategory, NewExpense, QueuedExpense } from "@/src/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiClient } from "./ApiClient";

const CACHE_KEY = "@expenses_cache";
const QUEUE_KEY = "@expenses_queue";

export class ExpenseService {
  private apiClient: ApiClient;
  private queue: QueuedExpense[] = [];

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
    this.loadQueue();
  }

  private async loadQueue(): Promise<void> {
    try {
      const queueData = await AsyncStorage.getItem(QUEUE_KEY);
      if (queueData) {
        this.queue = JSON.parse(queueData);
      }
    } catch (error) {
      console.log(error);
      this.queue = [];
    }
  }

  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.log(error);
      throw new Error("Failed to save queue");
    }
  }

  private async loadCache(): Promise<Expense[]> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  private async saveCache(expenses: Expense[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.log(error);
      throw new Error("Failed to save cache");
    }
  }

  async getTransactions(): Promise<Expense[]> {
    const response = await this.apiClient.get<Expense[]>("/expenses");

    if (response.success) {
      await this.saveCache(response.data);
      return response.data;
    }

    return this.loadCache();
  }

  async addTransaction(newExpense: NewExpense): Promise<Expense> {
    const expense: Expense = {
      id: `temp-${Date.now()}`,
      ...newExpense,
      date: newExpense.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const response = await this.apiClient.post<Expense, NewExpense>("/expenses", newExpense);

    if (!response.success) {
      this.queue.push({
        tempId: expense.id,
        expense: newExpense,
        timestamp: Date.now(),
      });
      await this.saveQueue();

      const cached = await this.loadCache();
      await this.saveCache([...cached, expense]);

      return expense;
    }

    return response.data;
  }

  async flushQueue(): Promise<void> {
    if (this.queue.length === 0) return;

    const queueCopy = [...this.queue];
    const successfulIds: string[] = [];

    for (const queuedItem of queueCopy) {
      const response = await this.apiClient.post<Expense, NewExpense>("/expenses", queuedItem.expense);

      if (response.success) {
        successfulIds.push(queuedItem.tempId);

        const cached = await this.loadCache();
        const updated = cached.map((exp) => (exp.id === queuedItem.tempId ? response.data : exp));
        await this.saveCache(updated);
      }
    }

    this.queue = this.queue.filter((item) => !successfulIds.includes(item.tempId));
    await this.saveQueue();
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  async getMockExpenses(): Promise<Expense[]> {
    const mockExpenses: Expense[] = [
      {
        id: "1",
        merchant: "Whole Foods",
        amount: 87.32,
        category: ExpenseCategory.FOOD,
        date: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "2",
        merchant: "Uber",
        amount: 23.5,
        category: ExpenseCategory.TRANSPORT,
        date: new Date(Date.now() - 172800000).toISOString(),
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: "3",
        merchant: "Netflix",
        amount: 15.99,
        category: ExpenseCategory.ENTERTAINMENT,
        date: new Date(Date.now() - 259200000).toISOString(),
        createdAt: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: "4",
        merchant: "Amazon",
        amount: 124.99,
        category: ExpenseCategory.SHOPPING,
        date: new Date(Date.now() - 345600000).toISOString(),
        createdAt: new Date(Date.now() - 345600000).toISOString(),
      },
    ];

    await this.saveCache(mockExpenses);
    return mockExpenses;
  }
}
