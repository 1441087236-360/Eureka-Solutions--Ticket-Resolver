import { useState } from 'react';
import {
  useForm,
  useWatch
} from 'react-hook-form';
import {
  z
} from 'zod';
import {
  zodResolver
} from '@hookform/resolvers/zod';
import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import {
  CheckCircle2,
  AlertCircle,
  Send,
  RotateCcw,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createTicket } from '../../api/ticketApi.js';
import {
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS
} from '../../constants/ticket.constants.js';

const ticketFormSchema = z.object({
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

  category: z
    .string()
    .refine(
      (value) => CATEGORY_OPTIONS.includes(value),
      'Please select a valid category.'
    ),

  priority: z
    .string()
    .refine(
      (value) => PRIORITY_OPTIONS.includes(value),
      'Please select a valid priority.'
    )
});

const defaultValues = {
  subject: '',
  description: '',
  category: '',
  priority: 'Medium'
};

function TicketForm() {
  const queryClient = useQueryClient();

  const [createdTicket, setCreatedTicket] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: {
      errors,
      isSubmitting,
      isDirty
    }
  } = useForm({
    resolver: zodResolver(ticketFormSchema),
    defaultValues,
    mode: 'onTouched'
  });

  const description = useWatch({ control, name: 'description' }) || '';

  const createMutation = useMutation({
    mutationFn: (ticketData) => createTicket(ticketData),

    onSuccess: async (response) => {
      const ticket = response.data;

      setCreatedTicket(ticket);

      reset(defaultValues);

      await queryClient.invalidateQueries({
        queryKey: ['tickets']
      });

      await queryClient.invalidateQueries({
        queryKey: ['dashboard-summary']
      });
    }
  });

  const onSubmit = async (formData) => {
    setCreatedTicket(null);

    try {
      await createMutation.mutateAsync(formData);
    } catch {
      // The mutation error.
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    setCreatedTicket(null);
    createMutation.reset();
  };

  return (
    <div className="ticket-form-layout">

      {createdTicket && (
        <div className="form-success-banner">

          <div className="form-feedback-icon success-feedback-icon">
            <CheckCircle2 size={22} />
          </div>

          <div className="form-feedback-content">
            <strong>Ticket created successfully!</strong>

            <p>
              Your ticket reference is{' '}
              <strong>{createdTicket.ticketNumber}</strong>.
            </p>

            <div className="form-success-actions">
              <Link
                to={`/tickets/${createdTicket._id}`}
                className="text-link"
              >
                View ticket
              </Link>

              <button
                type="button"
                className="text-link-button"
                onClick={() => setCreatedTicket(null)}
              >
                Create another
              </button>
            </div>
          </div>

        </div>
      )}

      {createMutation.isError && (
        <div className="form-error-banner">

          <AlertCircle size={19} />

          <div>
            <strong>Unable to create ticket</strong>

            <p>
              {createMutation.error?.response?.data?.message ||
                createMutation.error?.message ||
                'An unexpected error occurred. Please try again.'}
            </p>
          </div>

        </div>
      )}

      <form
        className="ticket-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >

        <div className="form-section-heading">
          <div className="form-section-icon">
            <FileText size={19} />
          </div>

          <div>
            <h3>Issue information</h3>

            <p>
              Describe the issue you want our support team to resolve.
            </p>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="subject">
            Ticket Subject
            <span className="required-mark">*</span>
          </label>

          <input
            id="subject"
            type="text"
            placeholder="e.g. Unable to access my account"
            maxLength={120}
            {...register('subject')}
            className={errors.subject ? 'field-error' : ''}
          />

          <div className="field-bottom">
            {errors.subject ? (
              <span className="field-error-message">
                {errors.subject.message}
              </span>
            ) : (
              <span>
                Provide a clear and descriptive subject.
              </span>
            )}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="description">
            Issue Description
            <span className="required-mark">*</span>
          </label>

          <textarea
            id="description"
            rows={6}
            maxLength={5000}
            placeholder="Explain your issue in detail. Include relevant information that may help the support team investigate..."
            {...register('description')}
            className={errors.description ? 'field-error' : ''}
          />

          <div className="field-bottom">
            {errors.description ? (
              <span className="field-error-message">
                {errors.description.message}
              </span>
            ) : (
              <span>
                Minimum 10 characters.
              </span>
            )}

            <span>{description.length}/5000</span>
          </div>
        </div>

        <div className="form-two-column">

          <div className="form-field">
            <label htmlFor="category">
              Category
              <span className="required-mark">*</span>
            </label>

            <select
              id="category"
              {...register('category')}
              className={errors.category ? 'field-error' : ''}
            >
              <option value="">Select category</option>

              {CATEGORY_OPTIONS.map((category) => (
                <option
                  value={category}
                  key={category}
                >
                  {category}
                </option>
              ))}
            </select>

            {errors.category && (
              <span className="field-error-message">
                {errors.category.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="priority">
              Priority
              <span className="required-mark">*</span>
            </label>

            <select
              id="priority"
              {...register('priority')}
              className={errors.priority ? 'field-error' : ''}
            >
              {PRIORITY_OPTIONS.map((priority) => (
                <option
                  value={priority}
                  key={priority}
                >
                  {priority}
                </option>
              ))}
            </select>

            {errors.priority && (
              <span className="field-error-message">
                {errors.priority.message}
              </span>
            )}
          </div>

        </div>

        <div className="initial-status-note">
          <div>
            <span className="initial-status-dot" />
            <strong>Initial status: Open</strong>
          </div>

          <p>
            Every newly submitted ticket automatically receives
            Open status and an initial status-history record.
          </p>
        </div>

        <div className="ticket-form-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={handleReset}
            disabled={isSubmitting || createMutation.isPending}
          >
            <RotateCcw size={15} />
            Reset
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={
              isSubmitting ||
              createMutation.isPending
            }
          >
            <Send size={15} />

            {createMutation.isPending
              ? 'Submitting...'
              : 'Submit Ticket'}
          </button>

        </div>

      </form>

    </div>
  );
}

export default TicketForm;