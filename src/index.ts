import { createServer } from 'http';
import { shutdownGracefully } from './utils/shutdown-gracefully';
import { logger } from './utils/logger';
import { env } from './env';
import { apiConfig } from './config';
import { app } from './app';

const server = createServer(app);
const PORT = env.PORT;
const HOST = env.HOST;

server.listen(PORT, HOST, () => {
  logger.info(`${apiConfig.title} is listening on http://${HOST}:${PORT}`);
  logger.info(`API documentation available at http://${HOST}:${PORT}/api-docs`);
});

process.on('SIGINT', () => shutdownGracefully({ signalOrEvent: 'SIGINT', server }));
process.on('SIGTERM', () => shutdownGracefully({ signalOrEvent: 'SIGTERM', server }));

process.on('uncaughtException', (error) => {
  shutdownGracefully({ signalOrEvent: 'uncaughtException', server, error });
});

process.on('unhandledRejection', (reason, promise) => {
  shutdownGracefully({ signalOrEvent: 'unhandledRejection', server, reason, promise });
});
