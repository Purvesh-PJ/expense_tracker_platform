// backend/app/models/Expense.js
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        enum: ['Food', 'Utilities', 'Entertainment', 'Transportation', 'Others'],
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
});

const Expense = mongoose.model('Expense', ExpenseSchema);
module.exports = Expense;
