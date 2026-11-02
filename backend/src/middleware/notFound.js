import ApiError from '../utils/ApiError.js';

const notFound = (req, res, next) => {
  next(
    new ApiError(
      404,
      `Route not found: ${req.method} ${req.originalUrl}`,
      'ROUTE_NOT_FOUND'
    )
  );
};

export default notFound;