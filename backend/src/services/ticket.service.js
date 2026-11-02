import mongoose from 'mongoose';
import Ticket from '../models/Ticket.js';
import {
  CATEGORY_VALUES,
  PRIORITY_VALUES,
  STATUS_VALUES
} from '../utils/ticket.constants.js';
import TicketComment from '../models/TicketComment.js';
import { generateTicketNumber } from '../utils/ticket-number.js';
import ApiError from '../utils/ApiError.js';

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const createUniqueTicketNumber = async () => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const ticketNumber = generateTicketNumber();

    const exists = await Ticket.exists({ ticketNumber });

    if (!exists) {
      return ticketNumber;
    }
  }

  throw new ApiError(
    500,
    'Unable to generate a unique ticket number.',
    'TICKET_NUMBER_GENERATION_FAILED'
  );
};
export const createTicket = async (input) => {
  if (
    !input ||
    !CATEGORY_VALUES.includes(input.category) ||
    (input.priority && !PRIORITY_VALUES.includes(input.priority))
  ) {
    throw new ApiError(
      400,
      'Invalid ticket information.',
      'INVALID_TICKET_DATA'
    );
  }

  const ticketNumber = await createUniqueTicketNumber();

  const ticket = await Ticket.create({
    ticketNumber,
    subject: input.subject,
    description: input.description,
    category: input.category,
    priority: input.priority || 'Medium',
    status: 'Open'
  });

  return ticket;
};

export const listTickets = async (query) => {
  const {
    page,
    limit,
    status,
    category,
    priority,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = query;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (category) {
    filter.category = category;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (search) {
    const safeSearch = escapeRegex(search);

    const searchRegex = new RegExp(
      safeSearch,
      'i'
    );

    filter.$or = [
      { ticketNumber: searchRegex },
      { subject: searchRegex },
      { description: searchRegex }
    ];
  }

  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .sort({
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
        _id: -1
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Ticket.countDocuments(filter)
  ]);

  return {
    tickets,

    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getTicketById = async (id) => {
  const ticket = await Ticket.findById(id).lean();

  if (!ticket) {
    throw new ApiError(
      404,
      'Ticket not found.',
      'TICKET_NOT_FOUND'
    );
  }

  return ticket;
};

export const updateTicketStatus = async (id, input) => {
  if (!STATUS_VALUES.includes(input.status)) {
    throw new ApiError(
      400,
      'Invalid ticket status.',
      'INVALID_TICKET_STATUS'
    );
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const currentTicket = await Ticket.findById(id);

    if (!currentTicket) {
      throw new ApiError(
        404,
        'Ticket not found.',
        'TICKET_NOT_FOUND'
      );
    }

    if (currentTicket.status === input.status) {
      return currentTicket.toObject();
    }

    const previousStatus = currentTicket.status;
    const updatedTicket = await Ticket.findOneAndUpdate(
      {
        _id: id,
        status: previousStatus
      },
      {
        $set: {
          status: input.status
        },

        $push: {
          statusHistory: {
            previousStatus,
            newStatus: input.status,
            changedAt: new Date(),
            changedBy: input.changedBy || 'Support Agent'
          }
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (updatedTicket) {
      return updatedTicket.toObject();
    }
  }

  throw new ApiError(
    409,
    'Ticket was modified concurrently. Please retry.',
    'TICKET_UPDATE_CONFLICT'
  );
};

export const getTicketHistory = async (id) => {
  const ticket = await Ticket.findById(id)
    .select('ticketNumber status statusHistory')
    .lean();

  if (!ticket) {
    throw new ApiError(
      404,
      'Ticket not found.',
      'TICKET_NOT_FOUND'
    );
  }

  return {
    ticketNumber: ticket.ticketNumber,
    currentStatus: ticket.status,
    history: ticket.statusHistory
  };
};

export const addTicketComment = async (ticketId, input) => {
  const ticketExists = await Ticket.exists({
    _id: ticketId
  });

  if (!ticketExists) {
    throw new ApiError(
      404,
      'Ticket not found. Cannot add comment.',
      'TICKET_NOT_FOUND'
    );
  }

  const comment = await TicketComment.create({
    ticket: ticketId,
    authorName: input.authorName,
    message: input.message
  });

  return comment;
};

export const listTicketComments = async (
  ticketId,
  query
) => {
  const ticket = await Ticket.findById(ticketId)
    .select('ticketNumber')
    .lean();

  if (!ticket) {
    throw new ApiError(
      404,
      'Ticket not found.',
      'TICKET_NOT_FOUND'
    );
  }

  const { page, limit } = query;

  const skip = (page - 1) * limit;

  const filter = {
    ticket: new mongoose.Types.ObjectId(ticketId)
  };

  const [comments, total] = await Promise.all([
    TicketComment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    TicketComment.countDocuments(filter)
  ]);

  return {
    ticketNumber: ticket.ticketNumber,
    comments,

    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};