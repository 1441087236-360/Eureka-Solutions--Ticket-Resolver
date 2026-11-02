import {
  describe,
  it,
  expect,
  beforeEach,
  vi
} from 'vitest';
import {
  render,
  screen
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import PriorityBadge from '../components/ui/PriorityBadge.jsx';
import TicketForm from '../features/tickets/TicketForm.jsx';
import { createTicket } from '../api/ticketApi.js';

vi.mock('../api/ticketApi.js', () => ({
  createTicket: vi.fn()
}));

const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      },

      mutations: {
        retry: false
      }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Reusable UI Components', () => {

  it('displays the correct ticket status', () => {
    render(
      <StatusBadge status="In Progress" />
    );

    expect(
      screen.getByText('In Progress')
    ).toBeInTheDocument();
  });

  it('displays ticket priority correctly', () => {
    render(
      <PriorityBadge priority="Urgent" />
    );

    expect(
      screen.getByText('Urgent')
    ).toBeInTheDocument();
  });

});

describe('Ticket Submission Form', () => {

  beforeEach(() => {
    createTicket.mockReset();
  });

  it('rejects empty required fields', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <TicketForm />
    );

    await user.click(
      screen.getByRole('button', {
        name: /submit ticket/i
      })
    );

    expect(
      await screen.findByText(
        'Subject must contain at least 3 characters.'
      )
    ).toBeInTheDocument();

    expect(createTicket).not.toHaveBeenCalled();
  });

  it('submits a valid ticket successfully', async () => {
    const user = userEvent.setup();

    createTicket.mockResolvedValue({
      success: true,

      data: {
        _id: '672abc123456789012345678',
        ticketNumber: 'TKT-2026-A10001'
      }
    });

    renderWithProviders(
      <TicketForm />
    );

    await user.type(
      screen.getByLabelText(/ticket subject/i),
      'Cannot access my account'
    );

    await user.type(
      screen.getByLabelText(/issue description/i),
      'I cannot log in to my account with my valid credentials.'
    );

    await user.selectOptions(
      screen.getByLabelText(/category/i),
      'Account'
    );

    await user.selectOptions(
      screen.getByLabelText(/priority/i),
      'High'
    );

    await user.click(
      screen.getByRole('button', {
        name: /submit ticket/i
      })
    );

    expect(createTicket).toHaveBeenCalledWith({
      subject: 'Cannot access my account',
      description:
        'I cannot log in to my account with my valid credentials.',
      category: 'Account',
      priority: 'High'
    });

    expect(
      await screen.findByText(
        'Ticket created successfully!'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText('TKT-2026-A10001')
    ).toBeInTheDocument();
  });

});