import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function TicketPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange
}) {
  const safeTotalPages = Math.max(totalPages, 1);

  const start = total === 0
    ? 0
    : (page - 1) * limit + 1;

  const end = Math.min(page * limit, total);

  return (
    <div className="ticket-pagination">

      <div className="pagination-info">
        Showing <strong>{start}</strong> to{' '}
        <strong>{end}</strong> of{' '}
        <strong>{total}</strong> tickets
      </div>

      <div className="pagination-controls">

        <button
          className="pagination-button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="pagination-current">
          Page <strong>{page}</strong> of{' '}
          <strong>{safeTotalPages}</strong>
        </span>

        <button
          className="pagination-button"
          disabled={page >= safeTotalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>

      </div>

    </div>
  );
}

export default TicketPagination;