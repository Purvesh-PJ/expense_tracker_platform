// backend/app/controllers/incomeController.js
const Income = require('../models/Income');

// Add new income
const addIncome = async (req, res) => {
    try {
        const { amount, date, source, description } = req.body;
        const userId = req.userId; // Assuming you have a userId from JWT authentication

        const newIncome = new Income({
            amount,
            date,
            source,
            description,
            user: userId,
        });

        await newIncome.save();
        res.status(201).json(newIncome);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add income' });
    }
};

// Get all income entries for a user
const getIncome = async (req, res) => {
    try {
        const userId = req.userId; // Assuming you have a userId from JWT authentication
        const incomeEntries = await Income.find({ user: userId });

        res.status(200).json(incomeEntries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch income' });
    }
};

// Edit an existing income entry
const editIncome = async (req, res) => {
    try {
        const incomeId = req.params.id;
        const { amount, date, source, description } = req.body;

        const updatedIncome = await Income.findByIdAndUpdate(
            incomeId,
            { amount, date, source, description },
            { new: true }
        );

        if (!updatedIncome) {
            return res.status(404).json({ message: 'Income entry not found' });
        }

        res.status(200).json(updatedIncome);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to edit income' });
    }
};

// Delete an income entry
const deleteIncome = async (req, res) => {
    try {
        const incomeId = req.params.id;
        const deletedIncome = await Income.findByIdAndDelete(incomeId);

        if (!deletedIncome) {
            return res.status(404).json({ message: 'Income entry not found' });
        }

        res.status(200).json({ message: 'Income deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete income' });
    }
};

module.exports = { addIncome, getIncome, editIncome, deleteIncome };
