import { z } from 'zod';
import {
  STATUS_VALUES,
  PRIORITY_VALUES,
  CATEGORY_VALUES
} from '../utils/ticket.constants.js';

export const objectIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    'Invalid MongoDB ID.'
  );

export const ticketIdSchema = z.object({
  id: objectIdSchema
});

export const createTicketSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(3, 'Subject must contain at least 3 characters.')
    .max(120, 'Subject cannot exceed 120 characters.'),

  description: z
    .string()
    .trim()
    .min(10, 'Description must contain at least 10 characters.')
    .max(5000, 'Description cannot exceed 5000 characters.'),

  category: z.enum(CATEGORY_VALUES, {
    error: 'A valid ticket category is required.'
  }),

  priority: z
    .enum(PRIORITY_VALUES)
    .default('Medium')
}).strict();


export const listTicketsSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10),

  status: z
    .enum(STATUS_VALUES)
    .optional(),

  category: z
    .enum(CATEGORY_VALUES)
    .optional(),

  priority: z
    .enum(PRIORITY_VALUES)
    .optional(),

  search: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((value) => value || undefined),

  sortBy: z
    .enum([
      'createdAt',
      'updatedAt',
      'priority',
      'status'
    ])
    .default('createdAt'),

  sortOrder: z
    .enum(['asc', 'desc'])
    .default('desc')
}).strict();


export const updateStatusSchema = z.object({
  status: z.enum(STATUS_VALUES),

  changedBy: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .default('Support Agent')
}).strict();

export const createCommentSchema = z.object({
  authorName: z
    .string()
    .trim()
    .min(2, 'Author name must contain at least 2 characters.')
    .max(80),

  message: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty.')
    .max(2000, 'Comment cannot exceed 2000 characters.')
}).strict();

export const listCommentsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(10)
}).strict();
