import { Link } from 'react-router-dom';
import {
  Plus,
  CalendarDays,
  RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/ui/PageHeader.jsx';
import {
  LoadingState,
  ErrorState
} from '../components/ui/Feedback.jsx';
import MetricCard from '../features/dashboard/MetricCard.jsx';
import DashboardCharts from '../features/dashboard/DashboardCharts.jsx';
import RecentTickets from '../features/dashboard/RecentTickets.jsx';
import { getDashboardSummary } from '../api/dashboardApi.js';

function DashboardPage() {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
    dataUpdatedAt
  } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardSummary,
    staleTime: 30000,
    refetchInterval: 60000
  });

  if (isPending) {
    return (
      <LoadingState message="Loading dashboard analytics..." />
    );
  }

  if (isError && !data) {
    return (
      <ErrorState
        title="Dashboard unavailable"
        message={
          error?.response?.data?.message ||
          error.message ||
          'Unable to load dashboard information.'
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return null;
  }

  const overview = data.overview;

  const metrics = [
    {
      label: 'Total Tickets',
      value: overview.totalTickets,
      description: 'All registered tickets',
      type: 'total',
      color: 'blue'
    },
    {
      label: 'Open Tickets',
      value: overview.openTickets,
      description: 'Awaiting attention',
      type: 'open',
      color: 'sky'
    },
    {
      label: 'In Progress',
      value: overview.inProgressTickets,
      description: 'Currently being handled',
      type: 'progress',
      color: 'amber'
    },
    {
      label: 'Resolved',
      value: overview.resolvedTickets,
      description: 'Successfully resolved',
      type: 'green',
      color: 'green'
    },
    {
      label: 'Resolution Rate',
      value: `${overview.resolutionRate}%`,
      description: 'Resolved / total tickets',
      type: 'rate',
      color: 'violet'
    }
  ];

  const lastUpdated = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dataUpdatedAt));

  return (
    <div className="page-container">

      <PageHeader
        eyebrow="SUPPORT OPERATIONS"
        title="Dashboard"
        description="Monitor ticket activity and track support performance."
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
              Create Ticket
            </Link>
          </>
        }
      />

      {isError && (
        <div className="inline-warning">
          Dashboard refresh failed. Showing the last successfully
          retrieved data.
        </div>
      )}

      <section className="dashboard-welcome">
        <div className="welcome-content">
          <span className="welcome-eyebrow">
            Welcome Admin, here's 
          </span>

          <h2>your support overview.</h2>

          <p>
            Track requests, monitor workload
            and measure the progress.
          </p>
        </div>

        <div className="welcome-illustration">
          <CalendarDays size={50} strokeWidth={1.3} />
        </div>
      </section>

      <section className="analytics-toolbar">
        <div>
          <h2>Overview</h2>
          <p>Live statistics...</p>
        </div>

        <span className="analytics-updated">
          Updated at {lastUpdated}
        </span>
      </section>

      <section className="metric-grid">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            {...metric}
          />
        ))}
      </section>

      <section className="activity-summary-grid">
        <div className="activity-summary-card">
          <span>Created today</span>
          <strong>{data.activity.createdToday}</strong>
          <small>New tickets today</small>
        </div>

        <div className="activity-summary-card">
          <span>Last 7 days</span>
          <strong>{data.activity.createdLast7Days}</strong>
          <small>Tickets received</small>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <h2>Analytics</h2>
          <p>Understand the ticket distribution.</p>
        </div>
      </section>

      <DashboardCharts
        statusBreakdown={data.statusBreakdown}
        priorityBreakdown={data.priorityBreakdown}
        categoryBreakdown={data.categoryBreakdown}
        dailyTrend={data.activity.dailyTrend}
      />

      <RecentTickets
        tickets={data.recentTickets}
      />

    </div>
  );
}

export default DashboardPage;