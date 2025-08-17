import React, { useState, useEffect } from 'react';
import { addIncome, getIncome, editIncome, deleteIncome } from '../services/IncomeService';
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

const IncomeForm = styled.form`
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

const IncomeTableContainer = styled.div`
    margin-top: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 15px;
`;

const TableHeading = styled.h3`
    text-align: center;
    margin-bottom: 20px;
    color: #4caf50;
`;

const IncomeTable = styled.table`
    width: 100%;
    background: #fff;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-collapse: collapse;
`;

const TableHeader = styled.thead`
    background-color: #4caf50;
    color: white;
`;

const TableHeaderCell = styled.th`
    padding: 10px;
    text-align: left;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
    background: #f9f9f9;
    border-bottom: 1px solid #ddd;

    &:hover {
        background: #f4f4f4;
    }
`;

const TableData = styled.td`
    padding: 10px;
`;

const NoIncomeMessage = styled.p`
    text-align: center;
    color: #888;
    font-size: 18px;
    margin-top: 20px;
`;

const ActionButton = styled.button`
    padding: 5px 10px;
    font-size: 14px;
    color: white;
    background-color: ${props => props.edit ? '#2196f3' : '#f44336'};
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${props => props.edit ? '#1e88e5' : '#e53935'};
    }

    margin: 0 5px;
`;

const SuccessMessage = styled.div`
    background-color: #4caf50;
    color: white;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin-bottom: 20px;
    font-size: 16px;
`;

const IncomeManagement = () => {
    const [income, setIncome] = useState([]);
    const [formData, setFormData] = useState({ amount: '', date: '', source: '', description: '' });
    const [editingIncome, setEditingIncome] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [filteredIncome, setFilteredIncome] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user && user.id;

    useEffect(() => {
        fetchIncome();
    }, []);

    useEffect(() => {
        filterIncome();
    }, [income]);

    const fetchIncome = async () => {
        try {
            const response = await getIncome(userId);
            setIncome(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error('Failed to fetch income', error);
        }
    };

    const filterIncome = () => {
        const filtered = income.filter(item => item.amount >= 10000 && item.amount <= 100000);
        setFilteredIncome(filtered);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingIncome) {
                await editIncome(editingIncome._id, { ...formData, user: userId });
                setEditingIncome(null);
                setSuccessMessage('Income updated successfully!');
            } else {
                await addIncome({ ...formData, user: userId });
                setSuccessMessage('Income added successfully!');
            }
            fetchIncome();
            setFormData({ amount: '', date: '', source: '', description: '' });
        } catch (error) {
            console.error('Failed to save income', error);
        }
    };

    const handleEdit = (incomeItem) => {
        setEditingIncome(incomeItem);
        setFormData({ ...incomeItem });
    };

    const handleDelete = async (id) => {
        try {
            await deleteIncome(id);
            setSuccessMessage('Income deleted successfully!');
            fetchIncome();
        } catch (error) {
            console.error('Failed to delete income', error);
        }
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    return (
        <Container>
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            <Title>{editingIncome ? 'Edit Income' : 'Add Income'}</Title>
            <IncomeForm onSubmit={handleSubmit}>
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
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Source</option>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Investments">Investments</option>
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
                    {editingIncome ? 'Update Income' : 'Add Income'}
                </button>
            </IncomeForm>

            <IncomeTableContainer>
                <TableHeading>Income List</TableHeading>
                <IncomeTable>
                    <TableHeader>
                        <tr>
                            <TableHeaderCell>Source</TableHeaderCell>
                            <TableHeaderCell>Amount</TableHeaderCell>
                            <TableHeaderCell>Date</TableHeaderCell>
                            <TableHeaderCell>Description</TableHeaderCell>
                            <TableHeaderCell>Actions</TableHeaderCell>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {filteredIncome.length === 0 ? (
                            <tr>
                                <td colSpan="5">
                                    <NoIncomeMessage>No income entries found in this range.</NoIncomeMessage>
                                </td>
                            </tr>
                        ) : (
                            filteredIncome.map((incomeItem) => (
                                <TableRow key={incomeItem._id}>
                                    <TableData>{incomeItem.source}</TableData>
                                    <TableData>${incomeItem.amount}</TableData>
                                    <TableData>{formatDate(incomeItem.date)}</TableData>
                                    <TableData>{incomeItem.description || 'No description'}</TableData>
                                    <TableData>
                                        <ActionButton edit onClick={() => handleEdit(incomeItem)}>Edit</ActionButton>
                                        <ActionButton onClick={() => handleDelete(incomeItem._id)}>Delete</ActionButton>
                                    </TableData>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </IncomeTable>
            </IncomeTableContainer>
        </Container>
    );
};

export default IncomeManagement;
