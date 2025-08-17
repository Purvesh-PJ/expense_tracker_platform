// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardOverview, getRecentTransactions, getBudgetStatus } = require('../controllers/DashboardControllers');

// Get Overview (Income, Expenses, Net Balance)
router.get('/overview', getDashboardOverview);

// Get Recent Transactions (Income & Expenses)
router.get('/recent-transactions', getRecentTransactions);

// Get Budget Status (Category-wise Spending)
router.get('/budget-status', getBudgetStatus);

module.exports = router;
