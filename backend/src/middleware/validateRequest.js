import ApiError from '../utils/ApiError.js';

const VALIDATION_PARTS = [
  'params',
  'query',
  'body'
];

export const validateRequest = (schemas = {}) => {
  return (req, res, next) => {
    try {
      const validated = {};

      for (const part of VALIDATION_PARTS) {
        const schema = schemas[part];

        if (!schema) {
          continue;
        }

        const result = schema.safeParse(req[part]);

        if (!result.success) {
          const details = result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
          }));

          return next(
            new ApiError(
              400,
              `Invalid request ${part}.`,
              'VALIDATION_ERROR',
              details
            )
          );
        }

        validated[part] = result.data;
      }

      req.validated = {
        ...(req.validated || {}),
        ...validated
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};