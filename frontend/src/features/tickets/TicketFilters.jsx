import {
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';
import {
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS
} from '../../constants/ticket.constants.js';

function TicketFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onClear
}) {
  const hasFilters = Boolean(
    search ||
    status ||
    category ||
    priority
  );

  return (
    <section className="ticket-filter-panel">

      <div className="filter-panel-heading">
        <div>
          <SlidersHorizontal size={17} />

          <strong>Search and filters</strong>
        </div>

        {hasFilters && (
          <button
            className="clear-filters-button"
            onClick={onClear}
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>

      <div className="ticket-filter-grid">

        <div className="filter-field search-field">
          <label htmlFor="ticket-search">
            Search tickets
          </label>

          <div className="search-input-wrapper">
            <Search size={17} />

            <input
              id="ticket-search"
              type="search"
              placeholder="Search ticket number or subject..."
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
            />
          </div>
        </div>

        <div className="filter-field">
          <label htmlFor="status-filter">
            Status
          </label>

          <select
            id="status-filter"
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value)
            }
          >
            <option value="">All statuses</option>

            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="category-filter">
            Category
          </label>

          <select
            id="category-filter"
            value={category}
            onChange={(event) =>
              onCategoryChange(event.target.value)
            }
          >
            <option value="">All categories</option>

            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="priority-filter">
            Priority
          </label>

          <select
            id="priority-filter"
            value={priority}
            onChange={(event) =>
              onPriorityChange(event.target.value)
            }
          >
            <option value="">All priorities</option>

            {PRIORITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="sort-filter">
            Sort by
          </label>

          <select
            id="sort-filter"
            value={sortBy}
            onChange={(event) =>
              onSortByChange(event.target.value)
            }
          >
            <option value="createdAt">Created date</option>
            <option value="updatedAt">Last updated</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="order-filter">
            Sort order
          </label>

          <select
            id="order-filter"
            value={sortOrder}
            onChange={(event) =>
              onSortOrderChange(event.target.value)
            }
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

      </div>
    </section>
  );
}

export default TicketFilters;