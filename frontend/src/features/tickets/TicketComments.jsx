import { useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import {
  useForm
} from 'react-hook-form';
import {
  z
} from 'zod';
import {
  zodResolver
} from '@hookform/resolvers/zod';
import {
  MessageSquare,
  Send,
  UserRound,
  LoaderCircle
} from 'lucide-react';
import {
  addTicketComment,
  getTicketComments
} from '../../api/ticketApi.js';
import {
  LoadingState,
  ErrorState,
  EmptyState
} from '../../components/ui/Feedback.jsx';

const commentSchema = z.object({
  authorName: z
    .string()
    .trim()
    .min(2, 'Author name must contain at least 2 characters.')
    .max(80, 'Author name is too long.'),

  message: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty.')
    .max(2000, 'Comment cannot exceed 2000 characters.')
});

const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

function TicketComments({ ticketId }) {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);

  const limit = 5;

  const {
    data,
    isPending,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['ticket-comments', ticketId, page],

    queryFn: () => getTicketComments(ticketId, {
      page,
      limit
    }),

    enabled: Boolean(ticketId),

    staleTime: 10000
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm({
    resolver: zodResolver(commentSchema),

    defaultValues: {
      authorName: '',
      message: ''
    }
  });

  const commentMutation = useMutation({
    mutationFn: (commentData) => {
      return addTicketComment(ticketId, commentData);
    },

    onSuccess: async () => {
      reset({
        authorName: '',
        message: ''
      });

      setPage(1);

      await queryClient.invalidateQueries({
        queryKey: ['ticket-comments', ticketId]
      });
    }
  });

  const onSubmit = async (formData) => {
    try {
      await commentMutation.mutateAsync(formData);
    } catch {
      // Mutation error 
    }
  };

  const comments = data?.data || [];

  const meta = data?.meta || {
    page: 1,
    totalPages: 1,
    total: 0
  };

  return (
    <section className="details-section comments-section">

      <div className="details-section-heading">
        <div className="details-section-heading-icon">
          <MessageSquare size={18} />
        </div>

        <div>
          <h3>Conversation</h3>

          <p>
            Discussion and updates related to this ticket.
          </p>
        </div>

        <span className="comment-count">
          {meta.total} Comments
        </span>
      </div>

      <form
        className="comment-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >

        <div className="comment-form-user">
          <UserRound size={17} />
        </div>

        <div className="comment-form-fields">

          <input
            type="text"
            placeholder="Your name"
            {...register('authorName')}
            className={errors.authorName ? 'field-error' : ''}
          />

          {errors.authorName && (
            <span className="field-error-message">
              {errors.authorName.message}
            </span>
          )}

          <textarea
            rows={3}
            maxLength={2000}
            placeholder="Write a comment or update..."
            {...register('message')}
            className={errors.message ? 'field-error' : ''}
          />

          {errors.message && (
            <span className="field-error-message">
              {errors.message.message}
            </span>
          )}

          {commentMutation.isError && (
            <div className="inline-form-error">
              {commentMutation.error?.response?.data?.message ||
                'Unable to add comment. Please retry.'}
            </div>
          )}

          <div className="comment-form-footer">
            <span>
              Keep comments professional and relevant.
            </span>

            <button
              type="submit"
              className="primary-button"
              disabled={
                isSubmitting ||
                commentMutation.isPending
              }
            >
              <Send size={14} />

              {commentMutation.isPending
                ? 'Posting...'
                : 'Post Comment'}
            </button>
          </div>

        </div>

      </form>


      <div className="comment-list">

        {isPending && (
          <LoadingState message="Loading conversation..." />
        )}

        {isError && (
          <ErrorState
            title="Unable to load comments"
            message={
              error?.response?.data?.message ||
              error.message
            }
            onRetry={() => refetch()}
          />
        )}

        {!isPending && !isError && comments.length === 0 && (
          <EmptyState
            title="No comments yet"
            message="Start the conversation by adding the first comment."
            icon={MessageSquare}
          />
        )}

        {comments.map((comment) => (
          <article
            className="comment-item"
            key={comment._id}
          >

            <div className="comment-avatar">
              <UserRound size={18} />
            </div>

            <div className="comment-content">

              <div className="comment-header">
                <strong>
                  {comment.authorName}
                </strong>

                <span>
                  {formatDateTime(comment.createdAt)}
                </span>
              </div>

              <p>{comment.message}</p>

            </div>

          </article>
        ))}

      </div>


      {meta.totalPages > 1 && (
        <div className="comment-pagination">

          <button
            className="secondary-button"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {meta.totalPages}
          </span>

          <button
            className="secondary-button"
            disabled={page >= meta.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>

        </div>
      )}

    </section>
  );
}

export default TicketComments;