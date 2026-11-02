import { rateLimit } from 'express-rate-limit';

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 300,

  standardHeaders: true,

  legacyHeaders: false,

  skip: (req) => {
    return req.path === '/health';
  },

  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: 'Too many authentication attempts.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  }
});