import { creatApp } from './app';
import { env } from './config';
import { logger } from './utils/logger';

const app = creatApp();

const server = app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

function shutdown(signal: string): void {
  logger.info(`${signal} recieved. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // force exit if shutdown hangs
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Rejection');
  throw reason;
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception - shutting down');
  process.exit(1);
});
