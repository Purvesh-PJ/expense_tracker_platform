// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Pie } from 'react-chartjs-2';  // For Pie Chart (e.g., income vs expense)
import { getDashboardOverview, getRecentTransactions, getBudgetStatus } from '../services/DashboardService';
// import { useAuth } from '../context/AuthContext';
// import { Navigate } from 'react-router-dom';


const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const OverviewCard = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
  text-align: center;
`;

const RecentTransactionsCard = styled.div`
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const BudgetCard = styled.div`
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
`;

const LoadingMessage = styled.div`
  background-color: #cce5ff;
  color: #004085;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
`;

const Dashboard = () => {
  const [overview, setOverview] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching

    try {
      const overviewData = await getDashboardOverview();
      setOverview(overviewData || mockOverviewData);  // Use mock data if no data is returned

      const transactionsData = await getRecentTransactions();
      setRecentTransactions(transactionsData || mockTransactionsData); // Use mock data if no transactions are found

      const budgetData = await getBudgetStatus();
      setBudgetStatus(budgetData || mockBudgetData); // Use mock data if no budget status is available
    } 
    catch (error) {
      setError('Failed to load dashboard data. Please try again later.');
      console.error('Error fetching dashboard data:', error);
    } 
    finally {
      setLoading(false);
    }
  };

  // Mock Data for Testing
  const mockOverviewData = {
    totalIncome: 5000,
    totalExpense: 2000,
    netBalance: 3000
  };

  const mockTransactionsData = [
    { category: 'Food', amount: 50, date: '2024-11-20' },
    { category: 'Transport', amount: 30, date: '2024-11-19' },
    { category: 'Shopping', amount: 120, date: '2024-11-18' }
  ];

  const mockBudgetData = [
    { category: 'Groceries', totalSpent: 100 },
    { category: 'Entertainment', totalSpent: 50 },
    { category: 'Rent', totalSpent: 1500 }
  ];

  // Chart Data for Income vs Expenses
  const incomeVsExpenseData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Income vs Expenses',
        data: [overview.totalIncome, overview.totalExpense],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverOffset: 4,
      },
    ],
  };


  if (loading) {
    return <LoadingMessage>Loading dashboard data...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <DashboardContainer>
      <h1>Dashboard</h1>

      {/* Overview Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <OverviewCard>
          <h2>Total Income</h2>
          <p>${overview.totalIncome}</p>
        </OverviewCard>
        <OverviewCard>
          <h2>Total Expenses</h2>
          <p>${overview.totalExpense}</p>
        </OverviewCard>
        <OverviewCard>
          <h2>Net Balance</h2>
          <p>${overview.netBalance}</p>
        </OverviewCard>
      </div>

      {/* Recent Transactions Section */}
      <RecentTransactionsCard>
        <h3>Recent Transactions</h3>
        <ul>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction, index) => (
              <li key={index}>
                {transaction.category}: ${transaction.amount} on {new Date(transaction.date).toLocaleDateString()}
              </li>
            ))
          ) : (
            <p>No recent transactions available.</p>
          )}
        </ul>
      </RecentTransactionsCard>

      {/* Budget Status Section */}
      <BudgetCard>
        <h3>Budget Status</h3>
        <ul>
          {budgetStatus.length > 0 ? (
            budgetStatus.map((budget) => (
              <li key={budget.category}>
                {budget.category}: ${budget.totalSpent} spent
              </li>
            ))
          ) : (
            <p>No budget data available.</p>
          )}
        </ul>
      </BudgetCard>

      {/* Pie Chart for Income vs Expenses */}
      <div style={{ width: '50%', marginTop: '20px' }}>
        <h3>Income vs Expenses</h3>
        <Pie data={incomeVsExpenseData} />
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;


