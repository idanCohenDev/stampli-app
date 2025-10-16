import Constants from 'expo-constants';

interface Env {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  SIMULATE_LATENCY: boolean;
  LATENCY_MS: number;
  FAILURE_RATE: number;
  ENVIRONMENT: 'development' | 'staging' | 'production';
}

const getEnv = (): Env => {
  const extra = Constants.expoConfig?.extra ?? {};

  return {
    API_BASE_URL: extra.apiBaseUrl ?? 'https://api.expenses.dev',
    API_TIMEOUT: extra.apiTimeout ?? 10000,
    SIMULATE_LATENCY: extra.simulateLatency ?? true,
    LATENCY_MS: extra.latencyMs ?? 1000,
    FAILURE_RATE: extra.failureRate ?? 0.1,
    ENVIRONMENT: extra.environment ?? 'development',
  };
};

export const env = getEnv();
