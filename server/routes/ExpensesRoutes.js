// backend/app/routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, editExpense, deleteExpense } = require('../controllers/ExpenseControllers');
const { authenticate } = require('../middleware/authenticate');

// Add a new expense
router.post('/add', authenticate, addExpense);

// Get all expenses for a user
router.get('/:userId', authenticate, getExpenses); 
// Edit an expense entry
router.put('/edit/:id', authenticate, editExpense);

// Delete an expense entry
router.delete('/delete/:id', authenticate, deleteExpense);

module.exports = router;
