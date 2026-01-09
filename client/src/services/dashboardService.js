import api from './api';

export const dashboardService = {
  async getOverview() {
    const response = await api.get('/dashboard/overview');
    return response.data;
  },

  async getRecentTransactions() {
    const response = await api.get('/dashboard/recent-transactions');
    return response.data;
  },

  async getBudgetStatus() {
    const response = await api.get('/dashboard/budget-status');
    return response.data;
  },
};

export default dashboardService;
