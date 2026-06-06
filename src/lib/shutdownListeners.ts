import type { Server } from 'node:http';
import { logger } from '@/lib/logger';

/**
 * Registers process hooks for graceful HTTP server shutdown on signals and fatal errors.
 * Call once after `server.listen` (typically gated by `DISABLE_SHUTDOWN_LISTENERS` from `env`).
 */
export function registerShutdownListeners(server: Server) {
  process.on('SIGINT', () => void shutdownGracefully({ signalOrEvent: 'SIGINT', server }));
  process.on('SIGTERM', () => void shutdownGracefully({ signalOrEvent: 'SIGTERM', server }));

  process.on('uncaughtException', (error) => {
    void shutdownGracefully({ signalOrEvent: 'uncaughtException', server, error });
  });

  process.on('unhandledRejection', (reason, promise) => {
    void shutdownGracefully({ signalOrEvent: 'unhandledRejection', server, reason, promise });
  });
}

let isShuttingDown = false;

type ShutdownGracefullyArgs = {
  signalOrEvent: NodeJS.Signals | 'uncaughtException' | 'unhandledRejection';
  server: Server;
  error?: unknown;
  reason?: unknown;
  promise?: Promise<unknown>;
};

async function shutdownGracefully({
  signalOrEvent,
  server,
  error,
  reason,
  promise,
}: ShutdownGracefullyArgs) {
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
  } catch (err) {
    logger.error(err, 'Error during graceful shutdown');
    clearTimeout(shutdownTimeout);
    process.exit(1);
  }
}
