import React, { useState, useEffect } from 'react';
import { addExpense, getExpenses, editExpense, deleteExpense } from '../services/ExpenseService';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    font-family: 'Arial', sans-serif;
`;

const Title = styled.h2`
    text-align: center;
    color: #4caf50;
`;

const ExpenseForm = styled.form`
    background: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    input, select, button {
        font-size: 16px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    input:focus, select:focus {
        outline: none;
        border-color: #4caf50;
    }

    button {
        background-color: #4caf50;
        color: white;
        cursor: pointer;
        border: none;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #45a049;
    }
`;

const ExpenseList = styled.div`
    margin-top: 20px;
    background: #fff;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ListTitle = styled.h3`
    text-align: center;
    color: #333;
    margin-bottom: 10px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
`;

const TableHeader = styled.th`
    background-color: #4caf50;
    color: white;
    padding: 10px;
    text-align: left;
    font-size: 16px;
    border: 1px solid #ddd;
`;

const TableRow = styled.tr`
    background-color: #f4f4f4;
    &:nth-child(even) {
        background-color: #e9e9e9;
    }
`;

const TableData = styled.td`
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 10px;

    button {
        padding: 5px 10px;
        font-size: 14px;
        color: white;
        background-color: #f44336;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #e53935;
    }

    button:nth-child(1) {
        background-color: #2196f3;
    }

    button:nth-child(1):hover {
        background-color: #1e88e5;
    }
`;

const NoExpensesMessage = styled.p`
    text-align: center;
    color: #888;
    font-size: 18px;
    margin-top: 20px;
`;

const SuccessMessage = styled.p`
    color: green;
    text-align: center;
    font-size: 16px;
    margin-top: 20px;
`;

const ErrorMessage = styled.p`
    color: red;
    text-align: center;
    font-size: 16px;
    margin-top: 20px;
`;

const ExpenseManagement = () => {
    const [expenses, setExpenses] = useState([]);  
    const [formData, setFormData] = useState({ amount: '', date: '', category: '', description: '' });
    const [editingExpense, setEditingExpense] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackError, setFeedbackError] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user && user.id;

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await getExpenses(userId);
            setExpenses(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error('Failed to fetch expenses', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingExpense) {
                await editExpense(editingExpense._id, { ...formData, user: userId });
                setFeedbackMessage('Expense successfully updated!');
                setFeedbackError('');
                setEditingExpense(null);
            } else {
                await addExpense({ ...formData, user: userId });
                setFeedbackMessage('Expense successfully added!');
                setFeedbackError('');
            }
            fetchExpenses();
            setFormData({ amount: '', date: '', category: '', description: '' });
        } catch (error) {
            console.error('Failed to save expense', error);
            setFeedbackMessage('');
            setFeedbackError('Failed to save expense');
        }
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setFormData({ ...expense });
    };

    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            setFeedbackMessage('Expense successfully deleted!');
            setFeedbackError('');
            fetchExpenses();
        } catch (error) {
            console.error('Failed to delete expense', error);
            setFeedbackMessage('');
            setFeedbackError('Failed to delete expense');
        }
    };

    return (
        <Container>
            <Title>{editingExpense ? 'Edit Expense' : 'Add Expense'}</Title>
            <ExpenseForm onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                />
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Others">Others</option>
                </select>
                <input
                    type="text"
                    name="description"
                    placeholder="Add a description (optional)"
                    value={formData.description}
                    onChange={handleInputChange}
                />
                <button type="submit">
                    {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
            </ExpenseForm>

            {feedbackMessage && <SuccessMessage>{feedbackMessage}</SuccessMessage>}
            {feedbackError && <ErrorMessage>{feedbackError}</ErrorMessage>}

            <ExpenseList>
                <ListTitle>Expense List</ListTitle>
                {expenses.length === 0 ? (
                    <NoExpensesMessage>No expenses found.</NoExpensesMessage>
                ) : (
                    <Table>
                        <thead>
                            <tr>
                                <TableHeader>Category</TableHeader>
                                <TableHeader>Amount</TableHeader>
                                <TableHeader>Date</TableHeader>
                                <TableHeader>Description</TableHeader>
                                <TableHeader>Actions</TableHeader>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <TableRow key={expense._id}>
                                    <TableData>{expense.category}</TableData>
                                    <TableData>${expense.amount}</TableData>
                                    <TableData>{new Date(expense.date).toLocaleDateString()}</TableData>
                                    <TableData>{expense.description || 'No description'}</TableData>
                                    <TableData>
                                        <ActionButtons>
                                            <button onClick={() => handleEdit(expense)}>Edit</button>
                                            <button onClick={() => handleDelete(expense._id)}>Delete</button>
                                        </ActionButtons>
                                    </TableData>
                                </TableRow>
                            ))}
                        </tbody>
                    </Table>
                )}
            </ExpenseList>
        </Container>
    );
};

export default ExpenseManagement;
