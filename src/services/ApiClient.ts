import axios, { AxiosInstance, isAxiosError } from 'axios';
import { ApiConfig, ApiError, ApiResponse } from '@/src/types';

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async simulateNetworkDelay(): Promise<void> {
    if (this.config.simulateLatency) {
      const delay = Math.random() * this.config.latencyMs;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  private shouldSimulateFailure(): boolean {
    return Math.random() < this.config.failureRate;
  }

  private async handleRequest<T>(requestFn: () => Promise<T>): Promise<ApiResponse<T>> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateFailure()) {
      throw new Error('Simulated network failure');
    }

    try {
      const data = await requestFn();
      return { data, success: true };
    } catch (error) {
      const apiError: ApiError = {
        message: isAxiosError(error) ? error.message : 'Unknown error',
        code: 'REQUEST_FAILED',
        status: isAxiosError(error) ? error.response?.status : undefined,
      };
      return { data: null as any, success: false, error: apiError };
    }
  }

  async get<T>(path: string): Promise<ApiResponse<T>> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get<T>(path);
      return response.data;
    });
  }

  async post<T, B>(path: string, body: B): Promise<ApiResponse<T>> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.post<T>(path, body);
      return response.data;
    });
  }
}
