import mongoose from 'mongoose';
import request from 'supertest';
import {
  beforeAll,
  afterAll,
  beforeEach,
  describe,
  expect,
  it
} from 'vitest';
import app from '../src/app.js';
import Ticket from '../src/models/Ticket.js';
import TicketComment from '../src/models/TicketComment.js';

const TEST_DATABASE_URI =
  process.env.MONGO_URI_TEST ||
  'mongodb://127.0.0.1:27017/support_ticket_tracker_test';

const validTicket = {
  subject: 'Cannot access my account',
  description:
    'I cannot log in even after entering the correct account credentials.',
  category: 'Account',
  priority: 'High'
};

const createTicketThroughApi = async (overrides = {}) => {
  return request(app)
    .post('/api/tickets')
    .send({
      ...validTicket,
      ...overrides
    });
};

describe('Support Ticket API Integration Tests', () => {

  beforeAll(async () => {
    await mongoose.connect(TEST_DATABASE_URI, {
      serverSelectionTimeoutMS: 5000
    });

    await Promise.all([
      Ticket.init(),
      TicketComment.init()
    ]);
  });

  beforeEach(async () => {
    await Promise.all([
      Ticket.deleteMany({}),
      TicketComment.deleteMany({})
    ]);
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  });

  describe('POST /api/tickets', () => {

    it('creates a new ticket successfully', async () => {
      const response = await createTicketThroughApi();

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);

      expect(response.body.data).toMatchObject({
        subject: validTicket.subject,
        category: 'Account',
        priority: 'High',
        status: 'Open'
      });

      expect(response.body.data.ticketNumber).toMatch(
        /^TKT-\d{4}-[A-F0-9]{6}$/
      );

      expect(
        response.body.data.statusHistory
      ).toHaveLength(1);

      expect(
        response.body.data.statusHistory[0]
      ).toMatchObject({
        previousStatus: null,
        newStatus: 'Open',
        changedBy: 'System'
      });

      expect(
        await Ticket.countDocuments()
      ).toBe(1);
    });

    it('rejects a ticket with missing required fields', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({
          subject: 'Invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('VALIDATION_ERROR');
    });

    it('rejects an invalid category', async () => {
      const response = await createTicketThroughApi({
        category: 'Unknown Category'
      });

      expect(response.status).toBe(400);
    });

    it('rejects an invalid priority', async () => {
      const response = await createTicketThroughApi({
        priority: 'Critical Plus'
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/tickets', () => {

    it('retrieves paginated tickets', async () => {
      await createTicketThroughApi();

      await createTicketThroughApi({
        subject: 'Billing issue with invoice',
        category: 'Billing',
        priority: 'Low'
      });

      const response = await request(app)
        .get('/api/tickets?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);

      expect(response.body.meta).toMatchObject({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1
      });
    });

    it('filters tickets by status and priority', async () => {
      await createTicketThroughApi({
        priority: 'High'
      });

      const second = await createTicketThroughApi({
        subject: 'Payment problem',
        category: 'Billing',
        priority: 'Low'
      });

      await request(app)
        .patch(`/api/tickets/${second.body.data._id}/status`)
        .send({
          status: 'Resolved',
          changedBy: 'Support Agent'
        });

      const response = await request(app)
        .get('/api/tickets?status=Open&priority=High');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);

      expect(response.body.data[0].priority).toBe('High');
    });

    it('searches by ticket subject', async () => {
      await createTicketThroughApi();

      await createTicketThroughApi({
        subject: 'Incorrect payment calculation',
        category: 'Billing'
      });

      const response = await request(app)
        .get('/api/tickets?search=payment');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/tickets/:id', () => {

    it('retrieves a ticket using its ID', async () => {
      const created = await createTicketThroughApi();

      const id = created.body.data._id;

      const response = await request(app)
        .get(`/api/tickets/${id}`);

      expect(response.status).toBe(200);

      expect(response.body.data._id).toBe(id);
    });

    it('returns 400 for an invalid MongoDB ID', async () => {
      const response = await request(app)
        .get('/api/tickets/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
    });

    it('returns 404 for a valid but nonexistent ID', async () => {
      const id = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/tickets/${id}`);

      expect(response.status).toBe(404);
      expect(response.body.code).toBe('TICKET_NOT_FOUND');
    });
  });

  describe('PATCH /api/tickets/:id/status', () => {

    it('updates status and records history', async () => {
      const created = await createTicketThroughApi();

      const id = created.body.data._id;

      const response = await request(app)
        .patch(`/api/tickets/${id}/status`)
        .send({
          status: 'In Progress',
          changedBy: 'Support Agent'
        });

      expect(response.status).toBe(200);

      expect(response.body.data.status).toBe(
        'In Progress'
      );

      expect(
        response.body.data.statusHistory
      ).toHaveLength(2);

      expect(
        response.body.data.statusHistory[1]
      ).toMatchObject({
        previousStatus: 'Open',
        newStatus: 'In Progress',
        changedBy: 'Support Agent'
      });
    });

    it('does not add duplicate history for unchanged status', async () => {
      const created = await createTicketThroughApi();

      const id = created.body.data._id;

      const response = await request(app)
        .patch(`/api/tickets/${id}/status`)
        .send({
          status: 'Open'
        });

      expect(response.status).toBe(200);

      expect(
        response.body.data.statusHistory
      ).toHaveLength(1);
    });

    it('rejects an invalid status', async () => {
      const created = await createTicketThroughApi();

      const response = await request(app)
        .patch(
          `/api/tickets/${created.body.data._id}/status`
        )
        .send({
          status: 'Cancelled'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Ticket comments', () => {

    it('adds and retrieves comments', async () => {
      const created = await createTicketThroughApi();

      const id = created.body.data._id;

      const added = await request(app)
        .post(`/api/tickets/${id}/comments`)
        .send({
          authorName: 'Support Agent',
          message: 'We are investigating this issue.'
        });

      expect(added.status).toBe(201);

      const response = await request(app)
        .get(`/api/tickets/${id}/comments`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);

      expect(response.body.data[0].message).toBe(
        'We are investigating this issue.'
      );
    });
  });

  describe('GET /api/dashboard/summary', () => {

    it('calculates dashboard counts from stored tickets', async () => {
      const first = await createTicketThroughApi();

      await createTicketThroughApi({
        subject: 'A second support issue',
        category: 'Technical',
        priority: 'Medium'
      });

      await request(app)
        .patch(
          `/api/tickets/${first.body.data._id}/status`
        )
        .send({
          status: 'Resolved'
        });

      const response = await request(app)
        .get('/api/dashboard/summary');

      expect(response.status).toBe(200);

      expect(response.body.data.overview).toMatchObject({
        totalTickets: 2,
        openTickets: 1,
        inProgressTickets: 0,
        resolvedTickets: 1,
        resolutionRate: 50
      });
    });
  });

});