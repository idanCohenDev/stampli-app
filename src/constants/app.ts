/**
 * App-wide constants
 */

export const APP_CONFIG = {
  ENABLE_DEV_TOOLS: __DEV__,
  ENABLE_PUSH_SIMULATION: __DEV__,

  DEFAULT_TIMEOUT: 10000,
  CACHE_EXPIRY: 5 * 60 * 1000,

  MAX_QUEUE_SIZE: 100,
  MAX_RETRY_ATTEMPTS: 3,
} as const;
