export const sendSuccess = (
  res,
  {
    statusCode = 200,
    message = 'Request completed successfully.',
    data = null,
    meta = undefined
  } = {}
) => {
  const response = {
    success: true,
    message,
    data
  };

  if (meta !== undefined) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

export const sendCreated = (
  res,
  data,
  message = 'Resource created successfully.'
) => {
  return sendSuccess(res, {
    statusCode: 201,
    message,
    data
  });
};

export const sendError = (
  res,
  {
    statusCode = 500,
    message = 'Internal server error.',
    code = 'INTERNAL_ERROR',
    details = undefined,
    stack = undefined
  } = {}
) => {
  const response = {
    success: false,
    message,
    code
  };

  if (details !== undefined) {
    response.details = details;
  }

  if (stack !== undefined) {
    response.stack = stack;
  }

  return res.status(statusCode).json(response);
};