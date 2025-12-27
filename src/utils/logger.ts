/* eslint-disable @typescript-eslint/no-explicit-any */

import { env } from '../env';

/**
 * A thin layer over console methods,
 * Replace with a more robust logger like winston or pino in production.
 */
class Logger {
  constructor(private enabled: boolean = true) {}

  log(message?: any, ...optionalParams: any[]) {
    if (this.enabled) {
      console.log(message, ...optionalParams);
    }
  }

  error(message?: any, ...optionalParams: any[]) {
    if (this.enabled) {
      console.error(message, ...optionalParams);
    }
  }

  warn(message?: any, ...optionalParams: any[]) {
    if (this.enabled) {
      console.warn(message, ...optionalParams);
    }
  }

  info(message?: any, ...optionalParams: any[]) {
    if (this.enabled) {
      console.info(message, ...optionalParams);
    }
  }
}

export const logger = new Logger(env.NODE_ENV !== 'test');
