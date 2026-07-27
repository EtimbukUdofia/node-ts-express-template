import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { env } from '../config';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

interface ErrorResponseBody {
  success: false;
  message: string;
  details?: unknown;
  stack?: string;
}

export function normaliseError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;

  if (err instanceof Error) {
    return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message, false);
  }

  return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occurred', false);
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const apiError = normaliseError(err);

  logger.error(
    {
      err: apiError,
      requestId: req.id,
      path: req.originalUrl,
      method: req.method,
    },
    apiError.message,
  );

  const body: ErrorResponseBody = {
    success: false,
    message: apiError.isOperational ? apiError.message : 'Something went wrong',
  };

  if (env.NODE_ENV === 'development') {
    body.details = apiError.details;
    body.stack = apiError.stack;
  }

  res.status(apiError.statusCode).json(body);
}
