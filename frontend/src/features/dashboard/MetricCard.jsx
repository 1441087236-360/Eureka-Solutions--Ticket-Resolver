import {
  Ticket,
  CircleDot,
  Clock3,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

const icons = {
  total: Ticket,
  open: CircleDot,
  progress: Clock3,
  resolved: CheckCircle2,
  rate: TrendingUp
};

function MetricCard({
  label,
  value,
  description,
  type,
  color
}) {
  const Icon = icons[type] || Ticket;

  return (
    <article className="metric-card">
      <div className="metric-card-top">
        <span className="metric-label">
          {label}
        </span>

        <div
          className={`metric-icon metric-icon-${color}`}
        >
          <Icon size={19} strokeWidth={1.9} />
        </div>
      </div>

      <strong className="metric-value">
        {value}
      </strong>

      <span className="metric-description">
        {description}
      </span>
    </article>
  );
}

export default MetricCard;