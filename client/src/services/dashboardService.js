import { incomeService } from './incomeService';
import { expenseService } from './expenseService';

export const dashboardService = {
  async getOverview(userId) {
    const [incomeData, expenseData] = await Promise.all([
      incomeService.getAll(userId),
      expenseService.getAll(userId),
    ]);

    const incomes = incomeData.incomes || [];
    const expenses = expenseData.expenses || [];

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
    };
  },

  async getRecentTransactions(userId) {
    const [incomeData, expenseData] = await Promise.all([
      incomeService.getAll(userId),
      expenseService.getAll(userId),
    ]);

    const incomes = (incomeData.incomes || []).map((i) => ({ ...i, type: 'income' }));
    const expenses = (expenseData.expenses || []).map((e) => ({ ...e, type: 'expense' }));

    const transactions = [...incomes, ...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    return { transactions };
  },

  async getBudgetStatus(userId) {
    const expenseData = await expenseService.getAll(userId);
    const expenses = expenseData.expenses || [];

    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const budgetStatus = Object.entries(categoryTotals).map(([category, spent]) => ({
      category,
      spent,
    }));

    return { budgetStatus };
  },
};

export default dashboardService;
