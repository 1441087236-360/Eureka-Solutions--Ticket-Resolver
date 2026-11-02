import Ticket from '../models/Ticket.js';
import {
  STATUS_VALUES,
  PRIORITY_VALUES,
  CATEGORY_VALUES
} from '../utils/ticket.constants.js';

const getDateBoundaries = () => {
  const now = new Date();

  const todayStart = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    )
  );

  const sevenDaysAgo = new Date(todayStart);

  sevenDaysAgo.setUTCDate(
    sevenDaysAgo.getUTCDate() - 6
  );

  return {
    now,
    todayStart,
    sevenDaysAgo
  };
};

const createCountMap = (values, rows) => {
  const result = {};

  for (const value of values) {
    const matchingRow = rows.find(
      (row) => row._id === value
    );

    result[value] = matchingRow?.count || 0;
  }

  return result;
};

const createSevenDayLabels = () => {
  const { todayStart } = getDateBoundaries();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(todayStart);

    date.setUTCDate(
      todayStart.getUTCDate() - 6 + index
    );

    return {
      date: date.toISOString().slice(0, 10),

      label: new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        timeZone: 'UTC'
      }).format(date)
    };
  });
};

export const getDashboardSummary = async () => {
  const {
    now,
    todayStart,
    sevenDaysAgo
  } = getDateBoundaries();

  const [result] = await Ticket.aggregate([
    {
      $facet: {
        totalTickets: [
          {
            $count: 'count'
          }
        ],

        statusBreakdown: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ],

        priorityBreakdown: [
          {
            $group: {
              _id: '$priority',
              count: { $sum: 1 }
            }
          }
        ],

        categoryBreakdown: [
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          }
        ],

       createdToday: [
          {
            $match: {
              createdAt: {
                $gte: todayStart,
                $lte: now
              }
            }
          },
          {
            $count: 'count'
          }
        ],

        createdLast7Days: [
          {
            $match: {
              createdAt: {
                $gte: sevenDaysAgo,
                $lte: now
              }
            }
          },
          {
            $count: 'count'
          }
        ],

        dailyTrend: [
          {
            $match: {
              createdAt: {
                $gte: sevenDaysAgo,
                $lte: now
              }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$createdAt',
                  timezone: 'UTC'
                }
              },
              count: {
                $sum: 1
              }
            }
          },
          {
            $sort: {
              _id: 1
            }
          }
        ],

        recentTickets: [
          {
            $sort: {
              createdAt: -1
            }
          },
          {
            $limit: 5
          },
          {
            $project: {
              _id: 1,
              ticketNumber: 1,
              subject: 1,
              category: 1,
              priority: 1,
              status: 1,
              createdAt: 1
            }
          }
        ]
      }
    }
  ]);

  const totalTickets =
    result.totalTickets[0]?.count || 0;

  const statusCounts = createCountMap(
    STATUS_VALUES,
    result.statusBreakdown
  );

  const priorityCounts = createCountMap(
    PRIORITY_VALUES,
    result.priorityBreakdown
  );

  const categoryCounts = createCountMap(
    CATEGORY_VALUES,
    result.categoryBreakdown
  );

  const dailyTrendMap = new Map(
    result.dailyTrend.map((item) => [
      item._id,
      item.count
    ])
  );

  const dailyTrend = createSevenDayLabels().map(
    (day) => ({
      date: day.date,
      label: day.label,
      count: dailyTrendMap.get(day.date) || 0
    })
  );

  const resolvedTickets =
    statusCounts['Resolved'];

  const resolutionRate = totalTickets > 0
    ? Number(
        ((resolvedTickets / totalTickets) * 100)
          .toFixed(2)
      )
    : 0;

  return {
    overview: {
      totalTickets,

      openTickets: statusCounts['Open'],

      inProgressTickets:
        statusCounts['In Progress'],

      resolvedTickets,

      resolutionRate
    },

    statusBreakdown: statusCounts,

    priorityBreakdown: priorityCounts,

    categoryBreakdown: categoryCounts,

    activity: {
      createdToday:
        result.createdToday[0]?.count || 0,

      createdLast7Days:
        result.createdLast7Days[0]?.count || 0,

      dailyTrend
    },

    recentTickets: result.recentTickets,

    generatedAt: now
  };
};