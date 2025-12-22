import { Server } from 'http';
import { logger } from './logger';

let isShuttingDown = false;

type ShutdownGracefully = {
  signalOrEvent: NodeJS.Signals | 'uncaughtException' | 'unhandledRejection';
  server: Server;
  error?: unknown;
  reason?: unknown;
  promise?: Promise<unknown>;
};

export async function shutdownGracefully({
  signalOrEvent,
  server,
  error,
  reason,
  promise,
}: ShutdownGracefully) {
  if (isShuttingDown) {
    logger.warn(`${signalOrEvent} received again, forcing exit`);
    process.exit(1);
  }

  isShuttingDown = true;
  if (error) logger.error(error, `Error during: ${signalOrEvent}`);
  if (reason && promise) logger.error({ reason, promise }, `Error during: ${signalOrEvent}`);
  logger.warn(`${signalOrEvent} received: starting graceful shutdown`);

  const shutdownTimeout = setTimeout(() => {
    logger.error('Graceful shutdown timeout, forcing exit');
    process.exit(1);
  }, 10000);

  try {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // TODO: Add any other cleanup logic here, like closing database connections, etc.

    logger.warn('Graceful shutdown completed');
    clearTimeout(shutdownTimeout);
    process.exit(0);
  } catch (error) {
    logger.error(error, 'Error during graceful shutdown');
    clearTimeout(shutdownTimeout);
    process.exit(1);
  }
}
