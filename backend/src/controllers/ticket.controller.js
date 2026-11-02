import { asyncHandler } from '../utils/asyncHandler.js';
import {
  sendSuccess,
  sendCreated
} from '../utils/apiResponse.js';
import * as ticketService from '../services/ticket.service.js';

export const createTicket = asyncHandler(
  async (req, res) => {
    const ticket = await ticketService.createTicket(
      req.validated.body
    );

    return sendCreated(
      res,
      ticket,
      'Ticket created successfully.'
    );
  }
);

export const listTickets = asyncHandler(
  async (req, res) => {
    const result = await ticketService.listTickets(
      req.validated.query
    );

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Tickets retrieved successfully.',
      data: result.tickets,
      meta: result.meta
    });
  }
);

export const getTicket = asyncHandler(
  async (req, res) => {
    const ticket = await ticketService.getTicketById(
      req.validated.params.id
    );

    return sendSuccess(res, {
      message: 'Ticket retrieved successfully.',
      data: ticket
    });
  }
);

export const updateStatus = asyncHandler(
  async (req, res) => {
    const ticket = await ticketService.updateTicketStatus(
      req.validated.params.id,
      req.validated.body
    );

    return sendSuccess(res, {
      message: 'Ticket status updated successfully.',
      data: ticket
    });
  }
);

export const getTicketHistory = asyncHandler(
  async (req, res) => {
    const history = await ticketService.getTicketHistory(
      req.validated.params.id
    );

    return sendSuccess(res, {
      message: 'Ticket history retrieved successfully.',
      data: history
    });
  }
);

export const addComment = asyncHandler(
  async (req, res) => {
    const comment = await ticketService.addTicketComment(
      req.validated.params.id,
      req.validated.body
    );

    return sendCreated(
      res,
      comment,
      'Comment added successfully.'
    );
  }
);

export const listComments = asyncHandler(
  async (req, res) => {
    const result = await ticketService.listTicketComments(
      req.validated.params.id,
      req.validated.query
    );

    return sendSuccess(res, {
      message: 'Comments retrieved successfully.',
      data: result.comments,
      meta: {
        ...result.meta,
        ticketNumber: result.ticketNumber
      }
    });
  }
);