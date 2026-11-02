import mongoose from 'mongoose';

const ticketCommentSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: [true, 'Associated ticket is required']
    },

    authorName: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      minlength: 2,
      maxlength: 80
    },

    message: {
      type: String,
      required: [true, 'Comment message is required'],
      trim: true,
      minlength: 1,
      maxlength: 2000
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'ticketcomments'
  }
);

ticketCommentSchema.index({
  ticket: 1,
  createdAt: 1
});

const TicketComment = mongoose.models.TicketComment || mongoose.model( 'TicketComment', ticketCommentSchema);

export default TicketComment;