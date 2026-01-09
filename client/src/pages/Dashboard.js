import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { MainLayout } from '../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Spinner, Text } from '../components/base';
import { dashboardService } from '../services';
import { formatCurrency, formatDate } from '../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $variant, theme }) => {
    if ($variant === 'income') return theme.colors.primary[100];
    if ($variant === 'expense') return theme.colors.secondary[100];
    return theme.colors.info + '20';
  }};
  color: ${({ $variant, theme }) => {
    if ($variant === 'income') return theme.colors.primary[600];
    if ($variant === 'expense') return theme.colors.secondary[600];
    return theme.colors.info;
  }};
`;

const StatContent = styled.div``;

const StatLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
`;

const StatValue = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ChartWrapper = styled.div`
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const TransactionInfo = styled.div``;

const TransactionDesc = styled.p`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
`;

const TransactionDate = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const TransactionAmount = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ $type, theme }) =>
    $type === 'income' ? theme.colors.primary[600] : theme.colors.secondary[600]};
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
`;

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewData, transactionsData, budgetData] = await Promise.all([
          dashboardService.getOverview(),
          dashboardService.getRecentTransactions(),
          dashboardService.getBudgetStatus(),
        ]);
        setOverview(overviewData);
        setTransactions(transactionsData.transactions || []);
        setBudgetStatus(budgetData.budgetStatus || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const doughnutData = {
    labels: budgetStatus.map((item) => item.category),
    datasets: [
      {
        data: budgetStatus.map((item) => item.spent),
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#607D8B'],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: budgetStatus.map((item) => item.category),
    datasets: [
      {
        label: 'Spent',
        data: budgetStatus.map((item) => item.spent),
        backgroundColor: '#F44336',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  if (loading) {
    return (
      <MainLayout title="Dashboard" subtitle="Overview of your finances">
        <LoadingWrapper><Spinner size="lg" /></LoadingWrapper>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Dashboard" subtitle="Overview of your finances">
      <StatsGrid>
        <StatCard $padding="md">
          <StatIcon $variant="income"><FiTrendingUp size={24} /></StatIcon>
          <StatContent>
            <StatLabel>Total Income</StatLabel>
            <StatValue>{formatCurrency(overview?.totalIncome || 0)}</StatValue>
          </StatContent>
        </StatCard>
        <StatCard $padding="md">
          <StatIcon $variant="expense"><FiTrendingDown size={24} /></StatIcon>
          <StatContent>
            <StatLabel>Total Expenses</StatLabel>
            <StatValue>{formatCurrency(overview?.totalExpenses || 0)}</StatValue>
          </StatContent>
        </StatCard>
        <StatCard $padding="md">
          <StatIcon $variant="balance"><FiDollarSign size={24} /></StatIcon>
          <StatContent>
            <StatLabel>Net Balance</StatLabel>
            <StatValue>{formatCurrency(overview?.netBalance || 0)}</StatValue>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <Card>
          <CardHeader><CardTitle>Expenses by Category</CardTitle></CardHeader>
          <CardContent>
            <ChartWrapper>
              {budgetStatus.length > 0 ? (
                <Doughnut data={doughnutData} options={chartOptions} />
              ) : (
                <Text $color="secondary">No expense data yet</Text>
              )}
            </ChartWrapper>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Spending Overview</CardTitle></CardHeader>
          <CardContent>
            <ChartWrapper>
              {budgetStatus.length > 0 ? (
                <Bar data={barData} options={chartOptions} />
              ) : (
                <Text $color="secondary">No expense data yet</Text>
              )}
            </ChartWrapper>
          </CardContent>
        </Card>
      </ChartsGrid>

      <Card>
        <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <TransactionList>
              {transactions.slice(0, 5).map((tx) => (
                <TransactionItem key={tx._id}>
                  <TransactionInfo>
                    <TransactionDesc>
                      {tx.description || tx.source || tx.category}
                      <Badge variant={tx.type === 'income' ? 'success' : 'danger'} style={{ marginLeft: 8 }}>
                        {tx.type}
                      </Badge>
                    </TransactionDesc>
                    <TransactionDate>{formatDate(tx.date)}</TransactionDate>
                  </TransactionInfo>
                  <TransactionAmount $type={tx.type}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </TransactionAmount>
                </TransactionItem>
              ))}
            </TransactionList>
          ) : (
            <Text $color="secondary">No transactions yet</Text>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Dashboard;
