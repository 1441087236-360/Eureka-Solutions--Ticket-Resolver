import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

import { EmptyState } from '../../components/ui/Feedback.jsx';

const STATUS_COLORS = {
  Open: '#3B82F6',
  'In Progress': '#E9A23B',
  Resolved: '#16A36A'
};

const PRIORITY_COLORS = {
  Low: '#94A3B8',
  Medium: '#3B82F6',
  High: '#E9A23B',
  Urgent: '#DC5252'
};

const CATEGORY_COLOR = '#5278D8';

const ChartCard = ({
  title,
  subtitle,
  children
}) => (
  <section className="chart-card">
    <div className="chart-card-heading">
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>

    {children}
  </section>
);

function DashboardCharts({
  statusBreakdown,
  priorityBreakdown,
  categoryBreakdown,
  dailyTrend
}) {
  const statusData = Object.entries(
    statusBreakdown || {}
  ).map(([name, value]) => ({
    name,
    value
  }));

  const priorityData = Object.entries(
    priorityBreakdown || {}
  ).map(([name, value]) => ({
    name,
    count: value
  }));

  const categoryData = Object.entries(
    categoryBreakdown || {}
  ).map(([name, value]) => ({
    name,
    count: value
  }));

  const hasStatus = statusData.some(
    (item) => item.value > 0
  );

  const hasPriority = priorityData.some(
    (item) => item.count > 0
  );

  const hasCategory = categoryData.some(
    (item) => item.count > 0
  );

  const hasTrend = dailyTrend?.some(
    (item) => item.count > 0
  );

  return (
    <div className="dashboard-charts">

      <ChartCard
        title="Ticket Status"
        subtitle="Distribution of all support tickets"
      >
        {hasStatus ? (
          <div className="status-chart-layout">

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={92}
                  paddingAngle={4}
                  stroke="none"
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name] || '#94A3B8'}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="chart-legend">
              {statusData.map((item) => (
                <div
                  className="chart-legend-item"
                  key={item.name}
                >
                  <span
                    className="legend-dot"
                    style={{
                      background: STATUS_COLORS[item.name]
                    }}
                  />

                  <span>{item.name}</span>

                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

          </div>
        ) : (
          <EmptyState
            title="No status data"
            message="Create tickets to see their status distribution."
          />
        )}
      </ChartCard>

      <ChartCard
        title="Priority Breakdown"
        subtitle="Tickets grouped by priority level"
      >
        {hasPriority ? (
          <ResponsiveContainer width="100%" height={290}>
            <BarChart
              data={priorityData}
              margin={{
                top: 15,
                right: 10,
                left: -15,
                bottom: 5
              }}
            >
              <CartesianGrid
                stroke="#EDF1F6"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#718096' }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: '#718096' }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Bar
                dataKey="count"
                name="Tickets"
                radius={[6, 6, 0, 0]}
              >
                {priorityData.map((item) => (
                  <Cell
                    key={item.name}
                    fill={PRIORITY_COLORS[item.name] || '#94A3B8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            title="No priority data"
            message="Priority statistics will appear here."
          />
        )}
      </ChartCard>

      <ChartCard
        title="Ticket Categories"
        subtitle="Distribution across issue categories"
      >
        {hasCategory ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{
                top: 5,
                right: 18,
                left: 12,
                bottom: 5
              }}
            >
              <CartesianGrid
                stroke="#EDF1F6"
                horizontal={false}
              />

              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 10, fill: '#718096' }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={105}
                tick={{ fontSize: 10, fill: '#718096' }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Bar
                dataKey="count"
                name="Tickets"
                fill={CATEGORY_COLOR}
                radius={[0, 5, 5, 0]}
                barSize={19}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            title="No category data"
            message="Category statistics will appear here."
          />
        )}
      </ChartCard>

      <ChartCard
        title="Ticket Creation Trend"
        subtitle="Daily ticket creation over the last seven days"
      >
        {hasTrend ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={dailyTrend}
              margin={{
                top: 15,
                right: 12,
                left: -15,
                bottom: 5
              }}
            >
              <defs>
                <linearGradient
                  id="ticketGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#4778E8"
                    stopOpacity={0.25}
                  />

                  <stop
                    offset="95%"
                    stopColor="#4778E8"
                    stopOpacity={0.01}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#EDF1F6"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#718096' }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: '#718096' }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="count"
                name="Tickets created"
                stroke="#4778E8"
                strokeWidth={2.5}
                fill="url(#ticketGradient)"
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            title="No recent activity"
            message="Ticket creation trends will appear here as new tickets arrive."
          />
        )}
      </ChartCard>

    </div>
  );
}

export default DashboardCharts;