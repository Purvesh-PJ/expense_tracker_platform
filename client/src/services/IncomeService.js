// frontend/src/services/IncomeService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/income';  // Adjust this according to your backend URL

// Add new income
export const addIncome = async (incomeData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, incomeData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Assuming JWT token is stored in localStorage
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding income:', error);
        throw error;
    }
};

// Get all income entries
export const getIncome = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching income:', error);
        throw error;
    }
};

// Edit an existing income
export const editIncome = async (id, incomeData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, incomeData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error editing income:', error);
        throw error;
    }
};

// Delete an income entry
export const deleteIncome = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting income:', error);
        throw error;
    }
};
