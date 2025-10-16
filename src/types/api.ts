/**
 * API-related type definitions
 */

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: ApiError;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  simulateLatency: boolean;
  latencyMs: number;
  failureRate: number; // 0-1, probability of random failure
}
