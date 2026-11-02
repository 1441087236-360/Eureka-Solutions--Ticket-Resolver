import { useState } from 'react';
import {
  Link,
  useParams
} from 'react-router-dom';
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FileText,
  RefreshCw,
  Send,
  Ticket,
  UserRound,
  History,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import PriorityBadge from '../components/ui/PriorityBadge.jsx';
import {
  LoadingState,
  ErrorState
} from '../components/ui/Feedback.jsx';
import TicketTimeline from '../features/tickets/TicketTimeline.jsx';
import TicketComments from '../features/tickets/TicketComments.jsx';
import {
  getTicketById,
  getTicketHistory,
  updateTicketStatus
} from '../api/ticketApi.js';
import {
  STATUS_OPTIONS
} from '../constants/ticket.constants.js';

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
};

const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

function TicketDetailsPage() {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const [statusSelection, setStatusSelection] = useState(null);

  const {
    data: ticket,
    isPending,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['ticket', id],

    queryFn: () => getTicketById(id),

    enabled: Boolean(id)
  });

  const {
    data: historyData,
    isPending: historyLoading,
    isError: historyError,
    refetch: refetchHistory
  } = useQuery({
    queryKey: ['ticket-history', id],

    queryFn: () => getTicketHistory(id),

    enabled: Boolean(id),

    staleTime: 10000
  });

  const selectedStatus =
    statusSelection?.ticketId === id &&
    statusSelection?.ticketStatus === ticket?.status
      ? statusSelection.value
      : ticket?.status || '';

  const statusMutation = useMutation({
    mutationFn: (status) => {
      return updateTicketStatus(id, {
        status,
        changedBy: 'Support Agent'
      });
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['ticket', id]
        }),

        queryClient.invalidateQueries({
          queryKey: ['ticket-history', id]
        }),

        queryClient.invalidateQueries({
          queryKey: ['tickets']
        }),

        queryClient.invalidateQueries({
          queryKey: ['dashboard-summary']
        })
      ]);
    }
  });

  const handleStatusUpdate = async (event) => {
    event.preventDefault();

    if (
      !selectedStatus ||
      selectedStatus === ticket?.status
    ) {
      return;
    }

    try {
      await statusMutation.mutateAsync(selectedStatus);
    } catch {
      // Display mutation error 
    }
  };

  if (isPending) {
    return (
      <LoadingState message="Loading ticket details..." />
    );
  }

  if (isError || !ticket) {
    return (
      <ErrorState
        title={
          error?.response?.status === 404
            ? 'Ticket not found'
            : 'Unable to load ticket'
        }
        message={
          error?.response?.data?.message ||
          error?.message ||
          'The requested ticket could not be retrieved.'
        }
        onRetry={() => refetch()}
      />
    );
  }

  const history =
    historyData?.history ||
    ticket.statusHistory ||
    [];

  return (
    <div className="page-container">

      <PageHeader
        eyebrow="SUPPORT MANAGEMENT"
        title="Ticket Details"
        description={`Reference: ${ticket.ticketNumber}`}
        actions={
          <>
            <button
              className="secondary-button"
              onClick={() => {
                refetch();
                refetchHistory();
              }}
            >
              <RefreshCw size={15} />
              Refresh
            </button>

            <Link
              to="/tickets"
              className="secondary-button"
            >
              <ArrowLeft size={15} />
              All Tickets
            </Link>
          </>
        }
      />

      <section className="ticket-detail-hero">

        <div className="ticket-detail-main">

          <span className="ticket-reference">
            <Ticket size={14} />
            {ticket.ticketNumber}
          </span>

          <h2>{ticket.subject}</h2>

          <div className="ticket-detail-badges">
            <StatusBadge status={ticket.status} />

            <PriorityBadge priority={ticket.priority} />

            <span className="category-chip">
              {ticket.category}
            </span>
          </div>

        </div>

        <div className="ticket-detail-date">
          <CalendarDays size={17} />

          <div>
            <span>Created on</span>
            <strong>{formatDate(ticket.createdAt)}</strong>
          </div>
        </div>

      </section>

      <div className="ticket-details-grid">

        <div className="ticket-details-primary">

          <section className="content-card details-section">

            <div className="details-section-heading">
              <div className="details-section-heading-icon">
                <FileText size={18} />
              </div>

              <div>
                <h3>Issue Description</h3>

                <p>
                  Complete information provided with the ticket.
                </p>
              </div>
            </div>

            <div className="ticket-description">
              {ticket.description}
            </div>

          </section>

          <section className="content-card details-section">

            <div className="details-section-heading">
              <div className="details-section-heading-icon">
                <History size={18} />
              </div>

              <div>
                <h3>Status History</h3>

                <p>
                  Complete record of ticket status changes.
                </p>
              </div>
            </div>

            {historyLoading ? (
              <LoadingState message="Loading status history..." />
            ) : historyError ? (
              <div className="inline-form-error">
                Unable to load status history.
              </div>
            ) : (
              <TicketTimeline history={history} />
            )}

          </section>

          <div className="content-card">
            <TicketComments ticketId={id} />
          </div>

        </div>

        <aside className="ticket-details-secondary">

          <section className="content-card details-sidebar-card">

            <div className="details-section-heading">
              <div className="details-section-heading-icon">
                <RefreshCw size={17} />
              </div>

              <div>
                <h3>Update Status</h3>

                <p>
                  Change the ticket's current state.
                </p>
              </div>
            </div>

            <form
              className="status-update-form"
              onSubmit={handleStatusUpdate}
            >

              <label htmlFor="ticket-status-update">
                New status
              </label>

              <select
                id="ticket-status-update"
                value={selectedStatus}
                onChange={(event) => setStatusSelection({
                  ticketId: id,
                  ticketStatus: ticket.status,
                  value: event.target.value
                })}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option
                    value={status}
                    key={status}
                  >
                    {status}
                  </option>
                ))}
              </select>

              {statusMutation.isError && (
                <div className="inline-form-error">
                  <AlertCircle size={14} />

                  {statusMutation.error?.response?.data?.message ||
                    'Unable to update ticket status.'}
                </div>
              )}

              {statusMutation.isSuccess && (
                <div className="inline-form-success">
                  <CheckCircle2 size={14} />
                  Ticket status updated successfully.
                </div>
              )}

              <button
                type="submit"
                className="primary-button status-submit-button"
                disabled={
                  statusMutation.isPending ||
                  selectedStatus === ticket.status
                }
              >
                <Send size={14} />

                {statusMutation.isPending
                  ? 'Updating...'
                  : 'Update Status'}
              </button>

            </form>

          </section>

          <section className="content-card details-sidebar-card">

            <div className="details-section-heading">
              <div className="details-section-heading-icon">
                <Ticket size={17} />
              </div>

              <div>
                <h3>Ticket Information</h3>

                <p>Record metadata.</p>
              </div>
            </div>

            <div className="ticket-metadata-list">

              <div className="metadata-item">
                <span>Ticket Reference</span>
                <strong>{ticket.ticketNumber}</strong>
              </div>

              <div className="metadata-item">
                <span>Category</span>
                <strong>{ticket.category}</strong>
              </div>

              <div className="metadata-item">
                <span>Priority</span>
                <PriorityBadge priority={ticket.priority} />
              </div>

              <div className="metadata-item">
                <span>Current Status</span>
                <StatusBadge status={ticket.status} />
              </div>

              <div className="metadata-item">
                <span>Created At</span>
                <strong>{formatDateTime(ticket.createdAt)}</strong>
              </div>

              <div className="metadata-item">
                <span>Last Updated</span>
                <strong>{formatDateTime(ticket.updatedAt)}</strong>
              </div>

            </div>

          </section>

          <section className="content-card workflow-note">

            <div>
              <Clock3 size={18} />
              <strong>Resolution workflow</strong>
            </div>

            <p>
              Every status change is recorded.
            </p>

            <div className="workflow-note-footer">
              <UserRound size={14} />
              Updated by User: <strong>Client</strong>
            </div>

          </section>

        </aside>

      </div>

    </div>
  );
}

export default TicketDetailsPage;