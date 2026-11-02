import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Ticket
} from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import PriorityBadge from '../../components/ui/PriorityBadge.jsx';
import { EmptyState } from '../../components/ui/Feedback.jsx';

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
};

function TicketTable({ tickets = [] }) {
  if (tickets.length === 0) {
    return (
      <EmptyState
        title="No tickets found"
        message="Try changing your filters or search terms. You can also create a new support ticket."
        icon={Ticket}
        action={
          <Link
            to="/tickets/new"
            className="primary-button"
          >
            Create Ticket
          </Link>
        }
      />
    );
  }

  return (
    <div className="table-wrapper">

      <table className="data-table ticket-directory-table">

        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Subject</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id}>

              <td>
                <Link
                  to={`/tickets/${ticket._id}`}
                  className="ticket-number-link"
                >
                  {ticket.ticketNumber}
                </Link>
              </td>

              <td>
                <Link
                  to={`/tickets/${ticket._id}`}
                  className="ticket-subject-link"
                >
                  {ticket.subject}
                </Link>
              </td>

              <td>
                <span className="category-label">
                  {ticket.category}
                </span>
              </td>

              <td>
                <PriorityBadge
                  priority={ticket.priority}
                />
              </td>

              <td>
                <StatusBadge
                  status={ticket.status}
                />
              </td>

              <td className="date-cell">
                {formatDate(ticket.createdAt)}
              </td>

              <td>
                <Link
                  to={`/tickets/${ticket._id}`}
                  className="table-action-link"
                  aria-label={`View ${ticket.ticketNumber}`}
                >
                  <ArrowUpRight size={17} />
                </Link>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default TicketTable;