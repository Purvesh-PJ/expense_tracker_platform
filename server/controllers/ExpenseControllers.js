// backend/app/controllers/expenseController.js
const ExpenseModel = require('../models/Expense');

// Add a new expense
const addExpense = async (req, res) => {
    try {
        const { amount, date, category, description } = req.body;
        const userId = req.userId;

        const newExpense = new ExpenseModel({
            amount,
            date,
            category,
            description,
            user: userId,
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add expense' });
    }
};

// Get all expenses for the user
const getExpenses = async (req, res) => {
    try {
        const userId = req.userId;
        console.log("getExp" ,userId);
        const expenses = await ExpenseModel.find({ user: userId });
        console.log(expenses);

        res.status(200).json(expenses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch expenses' });
    }
};

// Edit an existing expense
const editExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const { amount, date, category, description } = req.body;

        const updatedExpense = await ExpenseModel.findByIdAndUpdate(
            expenseId,
            { amount, date, category, description },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json(updatedExpense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to edit expense' });
    }
};

// Delete an expense
const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const deletedExpense = await ExpenseModel.findByIdAndDelete(expenseId);

        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete expense' });
    }
};

module.exports = { addExpense, getExpenses, editExpense, deleteExpense };


// Get expenses aggregated by category
exports.getCategoryExpenses = async (req, res) => {
    try {
        const expenses = await ExpenseModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to aggregate expenses', error });
    }
};

