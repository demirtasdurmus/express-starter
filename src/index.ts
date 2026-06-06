import { createServer } from 'node:http';
import { registerShutdownListeners } from '@/lib/shutdownListeners';
import { logger } from '@/lib/logger';
import { env } from '@/env';
import { apiConfig } from '@/config';
import { app } from '@/app';

const server = createServer(app);
const PORT = env.PORT;
const HOST = env.HOST;

server.listen(PORT, HOST, () => {
  logger.info(`${apiConfig.title} is listening on http://${HOST}:${PORT}`);
  logger.info(`API documentation available at http://${HOST}:${PORT}/api-docs`);
});

if (!env.DISABLE_SHUTDOWN_LISTENERS) {
  registerShutdownListeners(server);
}
