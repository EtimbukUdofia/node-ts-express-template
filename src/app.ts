import express, { Application, RequestHandler } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './utils/logger';
import { pinoHttp } from 'pino-http';
import { randomUUID } from 'node:crypto';
import { env } from './config';

export function creatApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(compression());
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  app.use(
    pinoHttp({
      logger,
      genReqId: () => randomUUID(),
      autoLogging: env.NODE_ENV !== 'test',
    }) as RequestHandler,
  );

  return app;
}
