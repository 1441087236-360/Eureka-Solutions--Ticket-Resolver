import mongoose from 'mongoose';
import { ZodError } from 'zod';
import ApiError from '../utils/ApiError.js';
import { sendError } from '../utils/apiResponse.js';

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let normalizedError = error;

  if (error instanceof ZodError) {
    normalizedError = new ApiError(
      400,
      'Request validation failed.',
      'VALIDATION_ERROR',
      error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    );
  }

  else if (
    error instanceof mongoose.Error.ValidationError
  ) {
    normalizedError = new ApiError(
      400,
      'Database document validation failed.',
      'DATABASE_VALIDATION_ERROR',
      Object.values(error.errors).map((item) => ({
        field: item.path,
        message: item.message
      }))
    );
  }

  else if (
    error instanceof mongoose.Error.CastError
  ) {
    normalizedError = new ApiError(
      400,
      'Invalid resource identifier.',
      'INVALID_ID',
      {
        field: error.path,
        value: String(error.value)
      }
    );
  }

  else if (error.code === 11000) {
    const field = Object.keys(
      error.keyValue || {}
    )[0];

    normalizedError = new ApiError(
      409,
      'A record with this value already exists.',
      'DUPLICATE_RESOURCE',
      field ? { field } : undefined
    );
  }

  else if (error.type === 'entity.parse.failed') {
    normalizedError = new ApiError(
      400,
      'Request contains invalid JSON.',
      'INVALID_JSON'
    );
  }

  else if (
    error.name === 'MongoServerSelectionError' ||
    error.name === 'MongoNetworkError'
  ) {
    normalizedError = new ApiError(
      503,
      'Database service is temporarily unavailable.',
      'DATABASE_UNAVAILABLE'
    );
  }

  if (!(normalizedError instanceof ApiError)) {
    console.error('Unexpected application error:', error);

    normalizedError = new ApiError(
      500,
      'An unexpected server error occurred.',
      'INTERNAL_ERROR'
    );
  }

  const isProduction =
    process.env.NODE_ENV === 'production';

  return sendError(res, {
    statusCode: normalizedError.statusCode || 500,
    message: normalizedError.message,
    code: normalizedError.code,
    details: isProduction
      ? undefined
      : normalizedError.details,
    stack: isProduction
      ? undefined
      : normalizedError.stack
  });
};

export default errorHandler;