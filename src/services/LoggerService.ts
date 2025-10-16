import Reactotron from "@/src/config/reactotron";

/**
 * Logger Service
 * Provides structured logging with different levels
 * Integrates with Reactotron in development
 */

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

class LoggerService {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = __DEV__;
  }

  debug(message: string, context?: string, data?: any): void {
    if (this.isDevelopment) {
      const display = context ? `[${context}] ${message}` : message;
      Reactotron.display?.({
        name: "🔍 DEBUG",
        value: data,
        preview: display,
        important: false,
      });
    }
  }

  info(message: string, context?: string, data?: any): void {
    if (this.isDevelopment) {
      const display = context ? `[${context}] ${message}` : message;
      Reactotron.display?.({
        name: "ℹ️ INFO",
        value: data,
        preview: display,
        important: false,
      });
    }
  }

  warn(message: string, context?: string, data?: any): void {
    const display = context ? `[${context}] ${message}` : message;

    if (this.isDevelopment) {
      Reactotron.display?.({
        name: "⚠️ WARN",
        value: data,
        preview: display,
        important: true,
      });
      console.warn(display, data);
    }
  }

  error(message: string, context?: string, data?: any): void {
    const display = context ? `[${context}] ${message}` : message;

    if (this.isDevelopment) {
      Reactotron.display?.({
        name: "❌ ERROR",
        value: data,
        preview: display,
        important: true,
      });
      console.error(display, data);
    }
  }
}

export const logger = new LoggerService();
