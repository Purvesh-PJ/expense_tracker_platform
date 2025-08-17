import axios from 'axios';

const API_URL = 'http://localhost:5000/expenses';

// Function to get the token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');  // Assuming the token is saved with the key 'authToken'
};

// Add Expense
export const addExpense = async (expenseData) => {
    const token = getAuthToken();  // Get the token from localStorage
    try {
        const response = await axios.post(`${API_URL}/add`, expenseData, {
            headers: {
                Authorization: `Bearer ${token}`,  // Attach the token in the Authorization header
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding expense:', error);
        throw error;
    }
};

// Get Expenses
export const getExpenses = async (userId) => {
    const token = getAuthToken();  // Get the token from localStorage
    try {
        const response = await axios.get(`${API_URL}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Attach the token in the Authorization header
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching expenses:', error);
        throw error;
    }
};

// Edit Expense
export const editExpense = async (id, expenseData) => {
    const token = getAuthToken();  // Get the token from localStorage
    try {
        const response = await axios.put(`${API_URL}/edit/${id}`, expenseData, {
            headers: {
                Authorization: `Bearer ${token}`,  // Attach the token in the Authorization header
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error editing expense:', error);
        throw error;
    }
};

// Delete Expense
export const deleteExpense = async (id) => {
    const token = getAuthToken();  // Get the token from localStorage
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Attach the token in the Authorization header
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting expense:', error);
        throw error;
    }
};
