import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { MainLayout } from '../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Modal, Spinner, Text } from '../components/base';
import TransactionForm from '../components/TransactionForm';
import { expenseService } from '../services';
import { useAuth } from '../context';
import { formatCurrency, formatDate } from '../utils/formatters';

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing[3]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  vertical-align: middle;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &.danger:hover {
    background-color: ${({ theme }) => theme.colors.secondary[50]};
    color: ${({ theme }) => theme.colors.secondary[600]};
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
`;

const CATEGORY_VARIANTS = {
  Food: 'warning',
  Utilities: 'info',
  Entertainment: 'neutral',
  Transportation: 'info',
  Others: 'neutral',
};

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchExpenses = async () => {
    try {
      const data = await expenseService.getAll(user._id);
      setExpenses(data.expenses || []);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchExpenses();
  }, [user]);

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await expenseService.delete(id);
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editingItem) {
        await expenseService.update(editingItem._id, data);
      } else {
        await expenseService.create(data);
      }
      setModalOpen(false);
      fetchExpenses();
    } catch (error) {
      console.error('Failed to save expense:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Expenses" subtitle="Track your spending">
        <LoadingWrapper><Spinner size="lg" /></LoadingWrapper>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Expenses" subtitle="Track your spending">
      <Card>
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
          <HeaderActions>
            <Button variant="danger" onClick={handleAdd}><FiPlus /> Add Expense</Button>
          </HeaderActions>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Category</Th>
                  <Th>Description</Th>
                  <Th>Amount</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <Td>{formatDate(expense.date)}</Td>
                    <Td>
                      <Badge variant={CATEGORY_VARIANTS[expense.category] || 'neutral'}>
                        {expense.category}
                      </Badge>
                    </Td>
                    <Td>{expense.description || '-'}</Td>
                    <Td style={{ fontWeight: 600, color: '#F44336' }}>
                      -{formatCurrency(expense.amount)}
                    </Td>
                    <Td>
                      <ActionButtons>
                        <IconButton onClick={() => handleEdit(expense)}><FiEdit2 size={16} /></IconButton>
                        <IconButton className="danger" onClick={() => handleDelete(expense._id)}><FiTrash2 size={16} /></IconButton>
                      </ActionButtons>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState>
              <Text $color="secondary">No expense records yet. Add your first expense!</Text>
            </EmptyState>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Expense' : 'Add Expense'}
      >
        <TransactionForm
          type="expense"
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Modal>
    </MainLayout>
  );
};

export default Expenses;
