import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { MainLayout } from '../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Modal, Spinner, Text } from '../components/base';
import TransactionForm from '../components/TransactionForm';
import { incomeService } from '../services';
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

const Income = () => {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchIncomes = async () => {
    try {
      const data = await incomeService.getAll(user._id);
      setIncomes(data.incomes || []);
    } catch (error) {
      console.error('Failed to fetch incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchIncomes();
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
    if (!window.confirm('Are you sure you want to delete this income?')) return;
    try {
      await incomeService.delete(id);
      setIncomes(incomes.filter((i) => i._id !== id));
    } catch (error) {
      console.error('Failed to delete income:', error);
    }
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editingItem) {
        await incomeService.update(editingItem._id, data);
      } else {
        await incomeService.create(data);
      }
      setModalOpen(false);
      fetchIncomes();
    } catch (error) {
      console.error('Failed to save income:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Income" subtitle="Manage your income sources">
        <LoadingWrapper><Spinner size="lg" /></LoadingWrapper>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Income" subtitle="Manage your income sources">
      <Card>
        <CardHeader>
          <CardTitle>Income Records</CardTitle>
          <HeaderActions>
            <Button onClick={handleAdd}><FiPlus /> Add Income</Button>
          </HeaderActions>
        </CardHeader>
        <CardContent>
          {incomes.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Source</Th>
                  <Th>Description</Th>
                  <Th>Amount</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((income) => (
                  <tr key={income._id}>
                    <Td>{formatDate(income.date)}</Td>
                    <Td><Badge variant="success">{income.source}</Badge></Td>
                    <Td>{income.description || '-'}</Td>
                    <Td style={{ fontWeight: 600, color: '#4CAF50' }}>
                      +{formatCurrency(income.amount)}
                    </Td>
                    <Td>
                      <ActionButtons>
                        <IconButton onClick={() => handleEdit(income)}><FiEdit2 size={16} /></IconButton>
                        <IconButton className="danger" onClick={() => handleDelete(income._id)}><FiTrash2 size={16} /></IconButton>
                      </ActionButtons>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState>
              <Text $color="secondary">No income records yet. Add your first income!</Text>
            </EmptyState>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Income' : 'Add Income'}
      >
        <TransactionForm
          type="income"
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Modal>
    </MainLayout>
  );
};

export default Income;
