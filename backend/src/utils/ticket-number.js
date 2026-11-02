import { randomBytes } from 'node:crypto';

export const generateTicketNumber = () => {
  const year = new Date().getFullYear();

  const randomCode = randomBytes(3)
    .toString('hex')
    .toUpperCase();

  return `TKT-${year}-${randomCode}`;
};