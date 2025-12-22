/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * A thin layer over console methods,
 * Replace with a more robust logger like winston or pino in production.
 */
class Logger {
  log(message?: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams);
  }

  error(message?: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
  }

  info(message?: any, ...optionalParams: any[]) {
    console.info(message, ...optionalParams);
  }
}

export const logger = new Logger();
