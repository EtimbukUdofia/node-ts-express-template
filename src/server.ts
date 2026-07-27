import { createApp } from './app';
import { env } from './config';
import { logger } from './utils/logger';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

let isShuttingDown = false;

function shutdown(signal: string, exitCode = 0): void {
  if (isShuttingDown) return;

  isShuttingDown = true;

  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(exitCode);
  });

  server.closeIdleConnections();

  // force exit if shutdown hangs
  setTimeout(() => process.exit(exitCode), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Rejection');
  shutdown('Unhandled Rejection', 1);
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception - shutting down');
  shutdown('Uncaught Exception', 1);
});
