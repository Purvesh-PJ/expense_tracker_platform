import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Input, Select } from './base';
import { formatDateInput } from '../utils/formatters';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const INCOME_SOURCES = [
  { value: 'Salary', label: 'Salary' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Investments', label: 'Investments' },
  { value: 'Others', label: 'Others' },
];

const EXPENSE_CATEGORIES = [
  { value: 'Food', label: 'Food' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Others', label: 'Others' },
];

const TransactionForm = ({ type, initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    amount: '',
    date: formatDateInput(new Date()),
    description: '',
    ...(type === 'income' ? { source: '' } : { category: '' }),
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount || '',
        date: formatDateInput(initialData.date || new Date()),
        description: initialData.description || '',
        ...(type === 'income'
          ? { source: initialData.source || '' }
          : { category: initialData.category || '' }),
      });
    }
  }, [initialData, type]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  const isIncome = type === 'income';
  const options = isIncome ? INCOME_SOURCES : EXPENSE_CATEGORIES;

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        id="amount"
        name="amount"
        type="number"
        label="Amount"
        placeholder="Enter amount"
        value={formData.amount}
        onChange={handleChange}
        min="0"
        step="0.01"
        required
      />

      <Input
        id="date"
        name="date"
        type="date"
        label="Date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <Select
        id={isIncome ? 'source' : 'category'}
        name={isIncome ? 'source' : 'category'}
        label={isIncome ? 'Source' : 'Category'}
        placeholder={`Select ${isIncome ? 'source' : 'category'}`}
        options={options}
        value={isIncome ? formData.source : formData.category}
        onChange={handleChange}
        required
      />

      <Input
        id="description"
        name="description"
        type="text"
        label="Description"
        placeholder="Enter description (optional)"
        value={formData.description}
        onChange={handleChange}
      />

      <ButtonGroup>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update' : 'Add'}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default TransactionForm;
