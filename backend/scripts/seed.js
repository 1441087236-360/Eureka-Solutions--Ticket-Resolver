import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import Ticket from '../src/models/Ticket.js';
import TicketComment from '../src/models/TicketComment.js';

const daysAgo = (days) => {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
};

const sampleTickets = [
  {
    ticketNumber: 'TKT-2026-A10001',
    subject: 'Unable to log in to my account',
    description:
      'I am receiving an authentication error whenever I attempt to log in, even though my username and password are correct.',
    category: 'Account',
    priority: 'High',
    status: 'Open',
    statusHistory: [
      {
        previousStatus: null,
        newStatus: 'Open',
        changedAt: daysAgo(1),
        changedBy: 'System'
      }
    ],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1)
  },

  {
    ticketNumber: 'TKT-2026-A10002',
    subject: 'Dashboard loading very slowly',
    description:
      'The application dashboard takes more than 30 seconds to load. The issue started after the latest application update.',
    category: 'Technical',
    priority: 'Urgent',
    status: 'In Progress',
    statusHistory: [
      {
        previousStatus: null,
        newStatus: 'Open',
        changedAt: daysAgo(3),
        changedBy: 'System'
      },
      {
        previousStatus: 'Open',
        newStatus: 'In Progress',
        changedAt: daysAgo(2),
        changedBy: 'Support Agent'
      }
    ],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2)
  },

  {
    ticketNumber: 'TKT-2026-A10003',
    subject: 'Incorrect payment amount',
    description:
      'My latest invoice contains an incorrect payment amount. Please investigate the billing statement and correct the discrepancy.',
    category: 'Billing',
    priority: 'High',
    status: 'Resolved',
    statusHistory: [
      {
        previousStatus: null,
        newStatus: 'Open',
        changedAt: daysAgo(6),
        changedBy: 'System'
      },
      {
        previousStatus: 'Open',
        newStatus: 'In Progress',
        changedAt: daysAgo(5),
        changedBy: 'Support Agent'
      },
      {
        previousStatus: 'In Progress',
        newStatus: 'Resolved',
        changedAt: daysAgo(4),
        changedBy: 'Support Agent'
      }
    ],
    createdAt: daysAgo(6),
    updatedAt: daysAgo(4)
  },

  {
    ticketNumber: 'TKT-2026-A10004',
    subject: 'Request to reset account password',
    description:
      'I have forgotten my account password and need assistance recovering access to my account.',
    category: 'Account',
    priority: 'Medium',
    status: 'Open',
    statusHistory: [
      {
        previousStatus: null,
        newStatus: 'Open',
        changedAt: daysAgo(0.5),
        changedBy: 'System'
      }
    ],
    createdAt: daysAgo(0.5),
    updatedAt: daysAgo(0.5)
  },

  {
    ticketNumber: 'TKT-2026-A10005',
    subject: 'Request for export functionality',
    description:
      'It would be helpful to have a feature that allows users to export dashboard reports into CSV or Excel format.',
    category: 'Feature Request',
    priority: 'Low',
    status: 'Resolved',
    statusHistory: [
      {
        previousStatus: null,
        newStatus: 'Open',
        changedAt: daysAgo(8),
        changedBy: 'System'
      },
      {
        previousStatus: 'Open',
        newStatus: 'In Progress',
        changedAt: daysAgo(7),
        changedBy: 'Support Agent'
      },
      {
        previousStatus: 'In Progress',
        newStatus: 'Resolved',
        changedAt: daysAgo(6),
        changedBy: 'Support Agent'
      }
    ],
    createdAt: daysAgo(8),
    updatedAt: daysAgo(6)
  }
];

const sampleComments = [
  {
    ticketNumber: 'TKT-2026-A10002',
    authorName: 'Support Agent',
    message:
      'We have identified a performance issue and our engineering team is investigating it.'
  },
  {
    ticketNumber: 'TKT-2026-A10003',
    authorName: 'Support Agent',
    message:
      'The billing discrepancy has been investigated and the corrected invoice has been generated.'
  },
  {
    ticketNumber: 'TKT-2026-A10004',
    authorName: 'Requester',
    message:
      'I have attempted the password recovery process but need additional assistance.'
  }
];

const seedDatabase = async () => {
  await connectDatabase();

  await Promise.all([
    Ticket.init(),
    TicketComment.init()
  ]);

  console.log('\nStarting database seeding...\n');

  const ticketMap = new Map();

  for (const ticketData of sampleTickets) {
    let ticket = await Ticket.findOne({
      ticketNumber: ticketData.ticketNumber
    });

    if (!ticket) {
      ticket = await Ticket.create(ticketData);

      console.log(`Created: ${ticket.ticketNumber}`);
    } else {
      console.log(`Already exists: ${ticket.ticketNumber}`);
    }

    ticketMap.set(ticket.ticketNumber, ticket);
  }

  for (const commentData of sampleComments) {
    const ticket = ticketMap.get(commentData.ticketNumber);

    if (!ticket) {
      continue;
    }

    const existingComment = await TicketComment.findOne({
      ticket: ticket._id,
      authorName: commentData.authorName,
      message: commentData.message
    });

    if (!existingComment) {
      await TicketComment.create({
        ticket: ticket._id,
        authorName: commentData.authorName,
        message: commentData.message
      });

      console.log(`Comment added to ${ticket.ticketNumber}`);
    }
  }

  const [ticketCount, commentCount] = await Promise.all([
    Ticket.countDocuments(),
    TicketComment.countDocuments()
  ]);

  console.log('\n======================================');
  console.log('  DATABASE SEEDING COMPLETED');
  console.log('======================================');
  console.log(`  Total tickets:  ${ticketCount}`);
  console.log(`  Total comments: ${commentCount}`);
  console.log('======================================\n');
};

try {
  await seedDatabase();
} catch (error) {
  console.error('Seeding failed:', error);
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}