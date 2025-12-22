import { createServer } from 'http';
import { shutdownGracefully } from './utils/shutdown-gracefully';
import { logger } from './utils/logger';
import { app } from './app';

const PORT = process.env.PORT || 3000;
const server = createServer(app);

server.listen(PORT, () => {
  logger.info(`Server listening on port: ${PORT}`);
});

process.on('SIGINT', () => shutdownGracefully({ signalOrEvent: 'SIGINT', server }));
process.on('SIGTERM', () => shutdownGracefully({ signalOrEvent: 'SIGTERM', server }));

process.on('uncaughtException', (error) => {
  shutdownGracefully({ signalOrEvent: 'uncaughtException', server, error });
});

process.on('unhandledRejection', (reason, promise) => {
  shutdownGracefully({ signalOrEvent: 'unhandledRejection', server, reason, promise });
});
