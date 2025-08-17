// backend/app/routes/incomeRoutes.js
const express = require('express');
const router = express.Router();
const { addIncome, getIncome, editIncome, deleteIncome } = require('../controllers/IncomeControllers');

// Middleware to authenticate and get the userId
const { authenticate } = require('../middleware/authenticate');

// Route to add a new income
router.post('/add', authenticate, addIncome);

// Route to get all income entries for the authenticated user
router.get('/:userId', authenticate, getIncome);

// Route to edit an income entry
router.put('/:id', authenticate, editIncome);

// Route to delete an income entry
router.delete('/:id', authenticate, deleteIncome);

module.exports = router;
