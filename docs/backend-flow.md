# Backend Flow

This document details the Node.js/Express backend architecture, request lifecycle, business logic, and data operations.

## Server Architecture

### Express Application Setup

**File:** `server/server.js`

```javascript
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// 1. Database Connection
connectDB();

// 2. Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// 3. Routes
app.use('/users', userRoutes);
app.use('/expenses', expenseRoutes);
app.use('/income', incomeRoutes);

// 4. Server Start
app.listen(5000, () => console.log('Server running on port 5000'));
```

## Request Lifecycle

### Complete Request Flow

```
1. HTTP Request arrives at Express
    ↓
2. CORS Middleware (validates origin)
    ↓
3. express.json() Middleware (parses JSON body)
    ↓
4. Router matches URL pattern
    ↓
5. authenticate() Middleware (if protected route)
    ├─ Extract token from Authorization header
    ├─ Verify JWT signature and expiration
    ├─ Decode payload to get userId
    └─ Attach userId to req.userId
    ↓
6. Controller function executes
    ├─ Extract data from req.body, req.params, req.userId
    ├─ Validate input (basic checks)
    ├─ Call Model methods
    └─ Handle errors with try-catch
    ↓
7. Model/Mongoose operations
    ├─ Build query
    ├─ Execute against MongoDB
    └─ Return results or throw error
    ↓
8. Controller sends response
    ├─ Success: res.status(200/201).json(data)
    └─ Error: res.status(400/500).json({ message })
    ↓
9. Response sent to client
```

## Middleware

### 1. Built-in Middleware

**CORS:**
```javascript
app.use(cors({ origin: 'http://localhost:3000' }));
```
- Allows requests from React dev server
- Enables credentials and headers
- Production should use environment variable for origin

**JSON Parser:**
```javascript
app.use(express.json());
```
- Parses incoming JSON request bodies
- Makes data available in req.body
- Automatically handles Content-Type: application/json

### 2. Custom Authentication Middleware

**File:** `server/middleware/authenticate.js`

```javascript
const authenticate = (req, res, next) => {
  // Extract token from header
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authorization required' });
  }
  
  try {
    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach userId to request
    req.userId = decoded.id;
    
    // Continue to next middleware/controller
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
```

**Usage:**
```javascript
router.post('/add', authenticate, addIncome);
router.get('/:userId', authenticate, getIncome);
```

## Routes

### Route Organization

**Pattern:** Each resource has its own route file

```
/users     → UserRoutes.js     → UserControllers.js
/income    → IncomeRoutes.js   → IncomeControllers.js
/expenses  → ExpensesRoutes.js → ExpenseControllers.js
/dashboard → DashboardRoutes.js → DashboardControllers.js (not connected)
```

### User Routes

**File:** `server/routes/UserRoutes.js`

```javascript
router.post('/register', registerUser);
router.post('/login', loginUser);
```

**Characteristics:**
- No authentication required (public endpoints)
- POST only (no GET for security)

### Income Routes

**File:** `server/routes/IncomeRoutes.js`

```javascript
router.post('/add', authenticate, addIncome);
router.get('/:userId', authenticate, getIncome);
router.put('/:id', authenticate, editIncome);
router.delete('/:id', authenticate, deleteIncome);
```

**Characteristics:**
- All routes protected with authenticate middleware
- RESTful design (POST, GET, PUT, DELETE)
- Uses :userId and :id URL parameters

### Expense Routes

**File:** `server/routes/ExpensesRoutes.js`

```javascript
router.post('/add', authenticate, addExpense);
router.get('/:userId', authenticate, getExpenses);
router.put('/edit/:id', authenticate, editExpense);
router.delete('/delete/:id', authenticate, deleteExpense);
```

**Characteristics:**
- Similar to income routes
- Inconsistent URL patterns (/edit/:id vs /:id, /delete/:id vs /:id)

### Dashboard Routes

**File:** `server/routes/DashboardRoutes.js`

```javascript
router.get('/overview', getDashboardOverview);
router.get('/recent-transactions', getRecentTransactions);
router.get('/budget-status', getBudgetStatus);
```

**Issue:** Not connected in server.js (missing app.use('/dashboard', dashboardRoutes))

## Controllers

### User Controller

**File:** `server/controllers/UserControllers.js`

**registerUser:**
```javascript
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user (password hashed by pre-save hook)
    const newUser = new User({ username, email, password });
    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register user' });
  }
};
```

**loginUser:**
```javascript
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Failed to login user' });
  }
};
```

### Income Controller

**File:** `server/controllers/IncomeControllers.js`

**addIncome:**
```javascript
const addIncome = async (req, res) => {
  try {
    const { amount, date, source, description } = req.body;
    const userId = req.userId; // From authenticate middleware
    
    const newIncome = new IncomeModel({
      amount,
      date,
      source,
      description,
      user: userId,
    });
    
    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add income' });
  }
};
```

**getIncome:**
```javascript
const getIncome = async (req, res) => {
  try {
    const userId = req.userId; // From middleware
    const incomes = await IncomeModel.find({ user: userId });
    res.status(200).json(incomes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch income' });
  }
};
```

**editIncome:**
```javascript
const editIncome = async (req, res) => {
  try {
    const incomeId = req.params.id;
    const { amount, date, source, description } = req.body;
    
    const updatedIncome = await IncomeModel.findByIdAndUpdate(
      incomeId,
      { amount, date, source, description },
      { new: true } // Return updated document
    );
    
    if (!updatedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }
    
    res.status(200).json(updatedIncome);
  } catch (err) {
    res.status(500).json({ message: 'Failed to edit income' });
  }
};
```

**deleteIncome:**
```javascript
const deleteIncome = async (req, res) => {
  try {
    const incomeId = req.params.id;
    const deletedIncome = await IncomeModel.findByIdAndDelete(incomeId);
    
    if (!deletedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }
    
    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete income' });
  }
};
```

### Expense Controller

**File:** `server/controllers/ExpenseControllers.js`

**Similar structure to Income Controller:**
- addExpense, getExpenses, editExpense, deleteExpense
- Uses category instead of source
- Same patterns for CRUD operations

### Dashboard Controller

**File:** `server/controllers/DashboardControllers.js`

**getDashboardOverview:**
```javascript
exports.getDashboardOverview = async (req, res) => {
  try {
    // Aggregate total income
    const totalIncome = await Income.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Aggregate total expenses
    const totalExpense = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Calculate net balance
    const netBalance = totalIncome[0]?.total - totalExpense[0]?.total;
    
    res.json({
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      netBalance: netBalance || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard overview' });
  }
};
```

**getRecentTransactions:**
```javascript
exports.getRecentTransactions = async (req, res) => {
  try {
    // Fetch recent income
    const recentIncome = await Income.find()
      .sort({ date: -1 })
      .limit(5);
    
    // Fetch recent expenses
    const recentExpenses = await Expense.find()
      .sort({ date: -1 })
      .limit(5);
    
    // Merge and sort by date
    const recentTransactions = [...recentIncome, ...recentExpenses]
      .sort((a, b) => b.date - a.date);
    
    res.json(recentTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recent transactions' });
  }
};
```

**getBudgetStatus:**
```javascript
exports.getBudgetStatus = async (req, res) => {
  try {
    const categories = ['Food', 'Utilities', 'Entertainment', 'Transportation', 'Others'];
    
    const budgetStatus = await Promise.all(
      categories.map(async (category) => {
        const totalSpent = await Expense.aggregate([
          { $match: { category } },
          { $group: { _id: null, totalSpent: { $sum: '$amount' } } },
        ]);
        
        return {
          category,
          totalSpent: totalSpent[0]?.totalSpent || 0,
        };
      })
    );
    
    res.json(budgetStatus);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch budget status' });
  }
};
```

## Models

### User Model

**File:** `server/models/User.js`

**Schema:**
```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  timestamps: true // createdAt, updatedAt
}
```

**Pre-save Hook (Password Hashing):**
```javascript
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
```

**Instance Method (Password Comparison):**
```javascript
UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

### Income Model

**File:** `server/models/Income.js`

**Schema:**
```javascript
{
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  source: {
    type: String,
    enum: ['Salary', 'Freelance', 'Investments', 'Others'],
    required: true
  },
  description: { type: String, required: false },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamps: true
}
```

### Expense Model

**File:** `server/models/Expense.js`

**Schema:**
```javascript
{
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: {
    type: String,
    enum: ['Food', 'Utilities', 'Entertainment', 'Transportation', 'Others'],
    required: true
  },
  description: { type: String, required: false },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamps: true
}
```

## Database Operations

### Connection Setup

**File:** `server/config/db.js`

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
```

### Common Query Patterns

**Find by User:**
```javascript
await Income.find({ user: userId });
await Expense.find({ user: userId });
```

**Find by ID:**
```javascript
await Income.findById(incomeId);
await Expense.findById(expenseId);
```

**Create:**
```javascript
const newIncome = new Income({ amount, date, source, user });
await newIncome.save();
```

**Update:**
```javascript
await Income.findByIdAndUpdate(id, updateData, { new: true });
```

**Delete:**
```javascript
await Income.findByIdAndDelete(id);
```

**Aggregation:**
```javascript
await Income.aggregate([
  { $group: { _id: null, total: { $sum: '$amount' } } }
]);

await Expense.aggregate([
  { $match: { category: 'Food' } },
  { $group: { _id: null, totalSpent: { $sum: '$amount' } } }
]);
```

## Error Handling

### Current Pattern

**Try-Catch in Every Controller:**
```javascript
const someController = async (req, res) => {
  try {
    // Business logic
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Generic error message' });
  }
};
```

**Issues:**
- Generic error messages (not specific to error type)
- No distinction between validation errors, database errors, etc.
- No centralized error handling
- Errors logged to console but not to file/service

### Potential Improvements

**Centralized Error Handler:**
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

**Custom Error Classes:**
```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}
```

## Validation

### Current State

**Minimal Validation:**
- Mongoose schema validation (required fields, enums)
- Basic existence checks (user exists, transaction exists)
- No input sanitization
- No request body validation library

### Missing Validations

- Email format validation
- Password strength requirements
- Amount must be positive
- Date must not be in future
- Description length limits
- SQL injection prevention (not applicable to MongoDB, but good practice)
- XSS prevention

### Recommended Improvements

**Use express-validator:**
```javascript
const { body, validationResult } = require('express-validator');

router.post('/add',
  authenticate,
  body('amount').isFloat({ min: 0.01 }),
  body('date').isISO8601(),
  body('source').isIn(['Salary', 'Freelance', 'Investments', 'Others']),
  addIncome
);
```

## Security Considerations

### Implemented

- Password hashing with bcrypt
- JWT authentication
- CORS configuration
- JSON body parsing limits (default)

### Missing

- JWT secret in environment variable (currently hardcoded)
- Rate limiting (no protection against brute force)
- Helmet.js for security headers
- Input sanitization
- SQL injection prevention (MongoDB is safer but still needs validation)
- HTTPS enforcement
- Refresh token mechanism
- Token blacklisting on logout

### Authorization Issues

**Current:** No ownership verification
- User A can delete User B's transactions if they know the ID
- Need to verify req.userId matches transaction.user before operations

**Fix:**
```javascript
const deleteIncome = async (req, res) => {
  const income = await Income.findById(req.params.id);
  
  if (!income) {
    return res.status(404).json({ message: 'Income not found' });
  }
  
  if (income.user.toString() !== req.userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  
  await income.remove();
  res.status(200).json({ message: 'Income deleted' });
};
```

## Performance Considerations

### Current Issues

- No pagination (loads all transactions)
- No database indexes (except default _id)
- Dashboard aggregations run on every request
- No caching mechanism
- Multiple database queries in dashboard (could be optimized)

### Recommended Improvements

**Add Indexes:**
```javascript
IncomeSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ user: 1, category: 1 });
```

**Pagination:**
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const incomes = await Income.find({ user: userId })
  .sort({ date: -1 })
  .skip(skip)
  .limit(limit);
```

**Caching with Redis:**
```javascript
const cachedData = await redis.get(`dashboard:${userId}`);
if (cachedData) {
  return res.json(JSON.parse(cachedData));
}

// Fetch from database
const data = await getDashboardData(userId);
await redis.setex(`dashboard:${userId}`, 300, JSON.stringify(data));
res.json(data);
```
