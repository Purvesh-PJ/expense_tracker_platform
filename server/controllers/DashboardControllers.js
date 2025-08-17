// backend/controllers/dashboardController.js
const Income = require('../models/Income');
const Expense = require('../models/Expense');

exports.getDashboardOverview = async (req, res) => {
  try {
    const totalIncome = await Income.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    const totalExpense = await Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);

    const netBalance = totalIncome[0]?.total - totalExpense[0]?.total;

    res.json({
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      netBalance: netBalance || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch dashboard overview' });
  }
};

exports.getRecentTransactions = async (req, res) => {
  try {
    const recentIncome = await Income.find().sort({ date: -1 }).limit(5);
    const recentExpenses = await Expense.find().sort({ date: -1 }).limit(5);
    const recentTransactions = [...recentIncome, ...recentExpenses].sort((a, b) => b.date - a.date);

    res.json(recentTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch recent transactions' });
  }
};

exports.getBudgetStatus = async (req, res) => {
  try {
    const categories = ['Food', 'Utilities', 'Entertainment', 'Transportation', 'Others'];
    const budgetStatus = await Promise.all(
      categories.map(async (category) => {
        const totalSpent = await Expense.aggregate([
          { $match: { category } },
          { $group: { _id: null, totalSpent: { $sum: '$amount' } } },
        ]);
        return { category, totalSpent: totalSpent[0]?.totalSpent || 0 };
      })
    );

    res.json(budgetStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch budget status' });
  }
};
