/**
 * AsyncStorage Keys
 * Centralized storage keys to prevent typos and make refactoring easier
 */

export const STORAGE_KEYS = {
  EXPENSES_CACHE: '@expenses_cache',
  EXPENSES_QUEUE: '@expenses_queue',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
