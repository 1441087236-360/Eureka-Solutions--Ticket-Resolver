import mongoose from 'mongoose';
import { STATUS_VALUES, PRIORITY_VALUES, CATEGORY_VALUES } from '../utils/ticket.constants.js';

const statusHistorySchema = new mongoose.Schema(
  {
    previousStatus: {
      type: String,
      enum: STATUS_VALUES,
      default: null
    },

    newStatus: {
      type: String,
      enum: STATUS_VALUES,
      required: [true, 'New status is required']
    },

    changedAt: {
      type: Date,
      default: Date.now,
      required: true
    },

    changedBy: {
      type: String,
      trim: true,
      default: 'System',
      maxlength: 80
    }
  },
  {
    _id: false
  }
);

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      trim: true,
      uppercase: true
    },

    subject: {
      type: String,
      required: [true, 'Ticket subject is required'],
      trim: true,
      minlength: [3, 'Subject must contain at least 3 characters'],
      maxlength: [120, 'Subject cannot exceed 120 characters']
    },

    description: {
      type: String,
      required: [true, 'Ticket description is required'],
      trim: true,
      minlength: [10, 'Description must contain at least 10 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },

    category: {
      type: String,
      required: [true, 'Ticket category is required'],
      enum: {
        values: CATEGORY_VALUES,
        message: 'Invalid ticket category'
      }
    },

    priority: {
      type: String,
      required: [true, 'Ticket priority is required'],
      enum: {
        values: PRIORITY_VALUES,
        message: 'Invalid ticket priority'
      },
      default: 'Medium'
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: STATUS_VALUES,
        message: 'Invalid ticket status'
      },
      default: 'Open'
    },

    statusHistory: {
      type: [statusHistorySchema],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'tickets'
  }
);

ticketSchema.pre('validate', function () {
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      previousStatus: null,
      newStatus: this.status,
      changedAt: new Date(),
      changedBy: 'System'
    });
  }
});

ticketSchema.index({
  status: 1,
  createdAt: -1
});

ticketSchema.index({
  category: 1,
  createdAt: -1
});

ticketSchema.index({
  priority: 1,
  createdAt: -1
});

ticketSchema.index({
  status: 1,
  category: 1,
  priority: 1,
  createdAt: -1
});

ticketSchema.index({
  subject: 'text',
  description: 'text'
});

const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

export default Ticket;