import express, { Application, RequestHandler } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './utils/logger';
import { pinoHttp } from 'pino-http';
import { randomUUID } from 'node:crypto';
import { env } from './config';
import { notFoundHandler } from './middlewares/notFound.middleware';
import { errorHandler } from './middlewares/error.middleware';

export function createApp(): Application {
  const app = express();

  app.use(
    pinoHttp({
      logger,
      genReqId: () => randomUUID(),
      autoLogging: env.NODE_ENV !== 'test',
    }) as RequestHandler,
  );

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(compression());
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
