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

export const STATUS_VALUES = Object.freeze(
  Object.values(TICKET_STATUS)
);

export const PRIORITY_VALUES = Object.freeze(
  Object.values(TICKET_PRIORITY)
);

export const CATEGORY_VALUES = Object.freeze(
  Object.values(TICKET_CATEGORY)
);

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

export const TICKET_NUMBER_PREFIX = 'TKT';