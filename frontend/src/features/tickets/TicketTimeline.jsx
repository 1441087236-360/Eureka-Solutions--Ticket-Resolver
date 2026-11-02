import {
  CircleDot,
  Clock3,
  CheckCircle2,
  History
} from 'lucide-react';
import { EmptyState } from '../../components/ui/Feedback.jsx';

const statusIcons = {
  Open: CircleDot,
  'In Progress': Clock3,
  Resolved: CheckCircle2
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

function TicketTimeline({ history = [] }) {
  const sortedHistory = [...history].sort(
    (a, b) =>
      new Date(a.changedAt) - new Date(b.changedAt)
  );

  if (sortedHistory.length === 0) {
    return (
      <EmptyState
        title="No status history"
        message="Status changes will appear here."
        icon={History}
      />
    );
  }

  return (
    <div className="ticket-timeline">

      {sortedHistory.map((item, index) => {
        const Icon =
          statusIcons[item.newStatus] || CircleDot;

        const isLatest =
          index === sortedHistory.length - 1;

        return (
          <div
            className={`timeline-item ${isLatest ? 'timeline-item-latest' : ''}`}
            key={`${item.changedAt}-${index}`}
          >
            <div className="timeline-connector">
              <div className="timeline-icon">
                <Icon size={16} />
              </div>

              {index !== sortedHistory.length - 1 && (
                <span className="timeline-line" />
              )}
            </div>

            <div className="timeline-content">

              <div className="timeline-title-row">
                <strong>
                  {item.previousStatus
                    ? `${item.previousStatus} → ${item.newStatus}`
                    : `Ticket created as ${item.newStatus}`}
                </strong>

                {isLatest && (
                  <span className="timeline-latest-label">
                    Latest
                  </span>
                )}
              </div>

              <p>
                {item.previousStatus
                  ? `Status changed from ${item.previousStatus} to ${item.newStatus}.`
                  : 'Initial ticket status recorded.'}
              </p>

              <div className="timeline-meta">
                <span>
                  {formatDateTime(item.changedAt)}
                </span>

                <span>·</span>

                <span>
                  By {item.changedBy || 'System'}
                </span>
              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
}

export default TicketTimeline;