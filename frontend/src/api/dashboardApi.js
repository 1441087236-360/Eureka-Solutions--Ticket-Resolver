import apiClient from './apiClient.js';

export const getDashboardSummary = async () => {
  const response = await apiClient.get('/dashboard/summary');

  return response.data.data;
};