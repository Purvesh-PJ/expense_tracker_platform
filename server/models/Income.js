// backend/app/models/Income.js
const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    source: {
        type: String,
        enum: ['Salary', 'Freelance', 'Investments', 'Others'],
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

const Income = mongoose.model('Income', IncomeSchema);
module.exports = Income;
