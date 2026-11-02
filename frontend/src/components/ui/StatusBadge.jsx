import { CheckCircle2, Clock3, CircleDot } from 'lucide-react';
import { STATUS_META } from '../../constants/ticket.constants';

const icons = {
  open: CircleDot,
  'in-progress': Clock3,
  resolved: CheckCircle2
};

function StatusBadge({ status }) {
  const config = STATUS_META[status];

  if (!config) {
    return (
      <span className="status-badge status-unknown">
        Unknown
      </span>
    );
  }

  const Icon = icons[config.className];

  return (
    <span className={`status-badge status-${config.className}`}>
      <Icon size={13} strokeWidth={2.2} />
      {config.label}
    </span>
  );
}

export default StatusBadge;