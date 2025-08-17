// frontend/src/services/dashboardService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard';

// Get Dashboard Overview (Income, Expenses, Balance)
export const getDashboardOverview = () => axios.get(`${API_URL}/overview`).then((res) => res.data);

// Get Recent Transactions
export const getRecentTransactions = () => axios.get(`${API_URL}/recent-transactions`).then((res) => res.data);

// Get Budget Status (Category-wise Spending)
export const getBudgetStatus = () => axios.get(`${API_URL}/budget-status`).then((res) => res.data);
