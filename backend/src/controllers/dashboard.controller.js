import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as dashboardService from '../services/dashboard.service.js';

export const getDashboardSummary = asyncHandler(
  async (req, res) => {
    const summary =
      await dashboardService.getDashboardSummary();

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Dashboard summary retrieved successfully.',
      data: summary
    });
  }
);
