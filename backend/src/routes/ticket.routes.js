import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createTicketSchema,
  listTicketsSchema,
  ticketIdSchema,
  updateStatusSchema,
  createCommentSchema,
  listCommentsSchema
} from '../validators/ticket.schemas.js';
import {
  createTicket,
  listTickets,
  getTicket,
  updateStatus,
  getTicketHistory,
  addComment,
  listComments
} from '../controllers/ticket.controller.js';

const router = Router();

router.post(
  '/',
  validateRequest({
    body: createTicketSchema
  }),
  createTicket
);

router.get(
  '/',
  validateRequest({
    query: listTicketsSchema
  }),
  listTickets
);

router.patch(
  '/:id/status',
  validateRequest({
    params: ticketIdSchema,
    body: updateStatusSchema
  }),
  updateStatus
);

router.get(
  '/:id/history',
  validateRequest({
    params: ticketIdSchema
  }),
  getTicketHistory
);

router.post(
  '/:id/comments',
  validateRequest({
    params: ticketIdSchema,
    body: createCommentSchema
  }),
  addComment
);

router.get(
  '/:id/comments',
  validateRequest({
    params: ticketIdSchema,
    query: listCommentsSchema
  }),
  listComments
);

router.get(
  '/:id',
  validateRequest({
    params: ticketIdSchema
  }),
  getTicket
);

export default router;