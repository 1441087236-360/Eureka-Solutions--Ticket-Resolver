export const TICKET_STATUS = Object.freeze({
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved'
});

export const TICKET_PRIORITY = Object.freeze({
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent'
});

export const TICKET_CATEGORY = Object.freeze({
  TECHNICAL: 'Technical',
  BILLING: 'Billing',
  ACCOUNT: 'Account',
  FEATURE_REQUEST: 'Feature Request',
  GENERAL: 'General'
});

export const STATUS_OPTIONS = Object.values(
  TICKET_STATUS
);

export const PRIORITY_OPTIONS = Object.values(
  TICKET_PRIORITY
);

export const CATEGORY_OPTIONS = Object.values(
  TICKET_CATEGORY
);

export const STATUS_META = Object.freeze({
  Open: {
    label: 'Open',
    className: 'open'
  },

  'In Progress': {
    label: 'In Progress',
    className: 'in-progress'
  },

  Resolved: {
    label: 'Resolved',
    className: 'resolved'
  }
});

export const PRIORITY_META = Object.freeze({
  Low: {
    label: 'Low',
    className: 'low'
  },

  Medium: {
    label: 'Medium',
    className: 'medium'
  },

  High: {
    label: 'High',
    className: 'high'
  },

  Urgent: {
    label: 'Urgent',
    className: 'urgent'
  }
});