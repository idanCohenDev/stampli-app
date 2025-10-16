import { ApiClient, ExpenseService } from '@/src/services';
import { ApiConfig } from '@/src/types';
import { env } from '@/src/config/env';

const apiConfig: ApiConfig = {
  baseUrl: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  simulateLatency: env.SIMULATE_LATENCY,
  latencyMs: env.LATENCY_MS,
  failureRate: env.FAILURE_RATE,
};

const apiClient = new ApiClient(apiConfig);
export const expenseService = new ExpenseService(apiClient);
