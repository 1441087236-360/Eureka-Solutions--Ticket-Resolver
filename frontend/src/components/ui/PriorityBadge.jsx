import {
  ArrowDown,
  Minus,
  ArrowUp,
  AlertTriangle
} from 'lucide-react';

import { PRIORITY_META } from '../../constants/ticket.constants';

const icons = {
  low: ArrowDown,
  medium: Minus,
  high: ArrowUp,
  urgent: AlertTriangle
};

function PriorityBadge({ priority }) {
  const config = PRIORITY_META[priority];

  if (!config) {
    return (
      <span className="priority-badge priority-unknown">
        Unknown
      </span>
    );
  }

  const Icon = icons[config.className];

  return (
    <span
      className={`priority-badge priority-${config.className}`}
    >
      <Icon size={13} strokeWidth={2.2} />
      {config.label}
    </span>
  );
}

export default PriorityBadge;