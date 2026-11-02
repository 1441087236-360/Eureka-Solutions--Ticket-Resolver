import { Link } from 'react-router-dom';
import { ArrowRight, Ticket } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import PriorityBadge from '../../components/ui/PriorityBadge.jsx';

import {
  EmptyState
} from '../../components/ui/Feedback.jsx';

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
};

function RecentTickets({ tickets = [] }) {
  return (
    <section className="content-card recent-tickets-card">

      <div className="section-heading recent-heading">
        <div>
          <h2>Recent Tickets</h2>

          <p>
            Latest support requests received by your team.
          </p>
        </div>

        <Link
          to="/tickets"
          className="text-link"
        >
          View all
          <ArrowRight size={15} />
        </Link>
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          title="No tickets available"
          message="New support requests will appear here."
          icon={Ticket}
          action={
            <Link
              to="/tickets/new"
              className="primary-button"
            >
              Create first ticket
            </Link>
          }
        />
      ) : (
        <div className="table-wrapper">

          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>
                    <Link
                      className="ticket-number-link"
                      to={`/tickets/${ticket._id}`}
                    >
                      {ticket.ticketNumber}
                    </Link>
                  </td>

                  <td className="table-subject">
                    {ticket.subject}
                  </td>

                  <td>{ticket.category}</td>

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
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

    </section>
  );
}

export default RecentTickets;