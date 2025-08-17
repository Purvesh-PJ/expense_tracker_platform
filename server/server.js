const express = require('express');
const cors = require('cors'); // Import cors
const connectDB = require('./config/db');
const userRoutes = require('./routes/UserRoutes');
const expenseRoutes = require('./routes/ExpensesRoutes');
const incomeRoutes = require('./routes/IncomeRoutes');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from React app
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/expenses', expenseRoutes);
app.use('/income', incomeRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

