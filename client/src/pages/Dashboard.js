import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { MainLayout } from '../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Spinner, Text, Table, Thead, Tbody, Tr, Th, Td, TableWrapper } from '../components/base';
import { dashboardService } from '../services';
import { useAuth } from '../context';
import { formatCurrency, formatDate } from '../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.neutral[0]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $gradient }) => $gradient};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $bg }) => $bg};
  color: white;
`;

const StatLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: ${({ theme }) => theme.spacing[2]} 0 0 0;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
`;

const ChartWrapper = styled.div`
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Amount = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ $type, theme }) =>
    $type === 'income' ? theme.colors.income : theme.colors.expense};
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Dashboard = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      try {
        const [overviewData, transactionsData, budgetData] = await Promise.all([
          dashboardService.getOverview(user._id),
          dashboardService.getRecentTransactions(user._id),
          dashboardService.getBudgetStatus(user._id),
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
  }, [user]);

  const chartColors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

  const doughnutData = {
    labels: budgetStatus.map((item) => item.category),
    datasets: [
      {
        data: budgetStatus.map((item) => item.spent),
        backgroundColor: chartColors,
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const barData = {
    labels: budgetStatus.map((item) => item.category),
    datasets: [
      {
        label: 'Spent',
        data: budgetStatus.map((item) => item.spent),
        backgroundColor: chartColors,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, usePointStyle: true, pointStyle: 'circle' },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: { beginAtZero: true, grid: { color: '#F1F5F9' } },
      x: { grid: { display: false } },
    },
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
        <StatCard $gradient="linear-gradient(135deg, #10B981 0%, #34D399 100%)">
          <StatHeader>
            <StatLabel>Total Income</StatLabel>
            <StatIcon $bg="linear-gradient(135deg, #10B981 0%, #34D399 100%)">
              <FiTrendingUp size={24} />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatCurrency(overview?.totalIncome || 0)}</StatValue>
        </StatCard>

        <StatCard $gradient="linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)">
          <StatHeader>
            <StatLabel>Total Expenses</StatLabel>
            <StatIcon $bg="linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)">
              <FiTrendingDown size={24} />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatCurrency(overview?.totalExpenses || 0)}</StatValue>
        </StatCard>

        <StatCard $gradient="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)">
          <StatHeader>
            <StatLabel>Net Balance</StatLabel>
            <StatIcon $bg="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)">
              <FiDollarSign size={24} />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatCurrency(overview?.netBalance || 0)}</StatValue>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
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
        </ChartCard>

        <ChartCard>
          <CardHeader><CardTitle>Spending Overview</CardTitle></CardHeader>
          <CardContent>
            <ChartWrapper>
              {budgetStatus.length > 0 ? (
                <Bar data={barData} options={barOptions} />
              ) : (
                <Text $color="secondary">No expense data yet</Text>
              )}
            </ChartWrapper>
          </CardContent>
        </ChartCard>
      </ChartsGrid>

      <Card>
        <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <TableWrapper>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Description</Th>
                    <Th>Type</Th>
                    <Th>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions.slice(0, 8).map((tx) => (
                    <Tr key={tx._id}>
                      <Td>{formatDate(tx.date)}</Td>
                      <Td>{tx.description || tx.source || tx.category}</Td>
                      <Td>
                        <Badge variant={tx.type === 'income' ? 'success' : 'danger'}>
                          {tx.type}
                        </Badge>
                      </Td>
                      <Td>
                        <Amount $type={tx.type}>
                          {tx.type === 'income' ? <FiArrowUpRight /> : <FiArrowDownRight />}
                          {formatCurrency(tx.amount)}
                        </Amount>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableWrapper>
          ) : (
            <EmptyState>No transactions yet. Start by adding income or expenses!</EmptyState>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Dashboard;
