import apiClient from './apiClient.js';

export const createTicket = async (ticketData) => {
  const response = await apiClient.post(
    '/tickets',
    ticketData
  );

  return response.data;
};

export const getTickets = async (params = {}) => {
  const response = await apiClient.get(
    '/tickets',
    { params }
  );

  return response.data;
};

export const getTicketById = async (id) => {
  const response = await apiClient.get(
    `/tickets/${encodeURIComponent(id)}`
  );

  return response.data.data;
};

export const updateTicketStatus = async (
  id,
  statusData
) => {
  const response = await apiClient.patch(
    `/tickets/${encodeURIComponent(id)}/status`,
    statusData
  );

  return response.data.data;
};

export const getTicketHistory = async (id) => {
  const response = await apiClient.get(
    `/tickets/${encodeURIComponent(id)}/history`
  );

  return response.data.data;
};

export const addTicketComment = async (
  id,
  commentData
) => {
  const response = await apiClient.post(
    `/tickets/${encodeURIComponent(id)}/comments`,
    commentData
  );

  return response.data.data;
};

export const getTicketComments = async (
  id,
  params = {}
) => {
  const response = await apiClient.get(
    `/tickets/${encodeURIComponent(id)}/comments`,
    { params }
  );

  return response.data;
};