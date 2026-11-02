import { useEffect, useMemo, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Plus, RefreshCw, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader.jsx';
import {
  LoadingState,
  ErrorState
} from '../components/ui/Feedback.jsx';
import TicketFilters from '../features/tickets/TicketFilters.jsx';
import TicketTable from '../features/tickets/TicketTable.jsx';
import TicketPagination from '../features/tickets/TicketPagination.jsx';
import { getTickets } from '../api/ticketApi.js';

function TicketsPage() {
  const [searchInput, setSearchInput] = useState('');

  const [search, setSearch] = useState('');

  const [status, setStatus] = useState('');

  const [category, setCategory] = useState('');

  const [priority, setPriority] = useState('');

  const [sortBy, setSortBy] = useState('createdAt');

  const [sortOrder, setSortOrder] = useState('desc');

  const [page, setPage] = useState(1);

  const limit = 10;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search, status, category, priority, sortBy, sortOrder]);

  const params = useMemo(() => ({
    page,
    limit,

    ...(search && { search }),
    ...(status && { status }),
    ...(category && { category }),
    ...(priority && { priority }),

    sortBy,
    sortOrder
  }), [
    page,
    limit,
    search,
    status,
    category,
    priority,
    sortBy,
    sortOrder
  ]);

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['tickets', params],

    queryFn: () => getTickets(params),

    placeholderData: keepPreviousData,

    staleTime: 15000
  });

  const tickets = data?.data || [];

  const meta = data?.meta || {
    page: 1,
    limit,
    total: 0,
    totalPages: 0
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatus('');
    setCategory('');
    setPriority('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  if (isPending) {
    return (
      <LoadingState message="Loading support tickets..." />
    );
  }

  if (isError && !data) {
    return (
      <ErrorState
        title="Unable to load tickets"
        message={
          error?.response?.data?.message ||
          error.message ||
          'The ticket service could not be reached.'
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="page-container">

      <PageHeader
        eyebrow="SUPPORT MANAGEMENT"
        title="All Tickets"
        description="Search, organize and track every support request."
        actions={
          <>
            <button
              className="secondary-button"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                size={15}
                className={isFetching ? 'loading-spinner' : ''}
              />

              Refresh
            </button>

            <Link
              to="/tickets/new"
              className="primary-button"
            >
              <Plus size={17} />
              New Ticket
            </Link>
          </>
        }
      />

      {isError && data && (
        <div className="inline-warning">
          Could not refresh tickets. Displaying previously retrieved data.
        </div>
      )}

      <section className="ticket-list-summary">
        <div className="ticket-list-summary-icon">
          <Ticket size={21} />
        </div>

        <div>
          <strong>{meta.total}</strong>
          <span>Total tickets</span>
        </div>

        {isFetching && (
          <span className="refresh-indicator">
            Updating...
          </span>
        )}
      </section>

      <TicketFilters
        search={searchInput}
        onSearchChange={setSearchInput}

        status={status}
        onStatusChange={setStatus}

        category={category}
        onCategoryChange={setCategory}

        priority={priority}
        onPriorityChange={setPriority}

        sortBy={sortBy}
        onSortByChange={setSortBy}

        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}

        onClear={clearFilters}
      />

      <section className="content-card ticket-directory-card">

        <div className="ticket-directory-heading">
          <div>
            <h2>Ticket directory</h2>

            <p>
              Browse and manage your requests.
            </p>
          </div>
        </div>

        <TicketTable tickets={tickets} />

        <TicketPagination
          page={meta.page}
          limit={meta.limit}
          total={meta.total}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />

      </section>

    </div>
  );
}

export default TicketsPage;