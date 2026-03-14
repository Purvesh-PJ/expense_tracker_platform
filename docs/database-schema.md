# Database Schema

MongoDB database structure for the Expense Tracker application.

## Database Information

**Database Name:** `expense_tracker` (default, can be configured)

**ODM:** Mongoose 8.8.2

**Connection:** MongoDB (local or MongoDB Atlas)

---

## Collections

### 1. users

**Purpose:** Store user account information

**Schema Definition:** `server/models/User.js`

**Fields:**

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| `_id` | ObjectId | Auto | Yes | MongoDB auto-generated ID |
| `username` | String | Yes | Yes | User's display name |
| `email` | String | Yes | Yes | User's email (used for login) |
| `password` | String | Yes | No | Bcrypt hashed password |
| `createdAt` | Date | Auto | No | Account creation timestamp |
| `updatedAt` | Date | Auto | No | Last update timestamp |

**Indexes:**
- `_id` (default)
- `email` (unique)
- `username` (unique)

**Pre-save Hook:**
```javascript
// Automatically hashes password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

**Instance Methods:**
```javascript
// Compare plain text password with hashed password
UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

**Example Document:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "username": "johndoe",
  "email": "john@example.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  "createdAt": ISODate("2024-03-01T10:30:00.000Z"),
  "updatedAt": ISODate("2024-03-01T10:30:00.000Z")
}
```

**Security Notes:**
- Password is never stored in plain text
- Bcrypt salt rounds: 10
- comparePassword method uses constant-time comparison

---

### 2. incomes

**Purpose:** Store income transaction records

**Schema Definition:** `server/models/Income.js`

**Fields:**

| Field | Type | Required | Enum Values | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | - | MongoDB auto-generated ID |
| `amount` | Number | Yes | - | Income amount (positive number) |
| `date` | Date | Yes | - | Date of income transaction |
| `source` | String | Yes | Salary, Freelance, Investments, Others | Income source category |
| `description` | String | No | - | Optional notes about the income |
| `user` | ObjectId | Yes | - | Reference to users collection |
| `createdAt` | Date | Auto | - | Record creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

**Relationships:**
- `user` field references `users._id` (many-to-one)

**Recommended Indexes (not currently implemented):**
```javascript
IncomeSchema.index({ user: 1, date: -1 }); // Query by user, sort by date
IncomeSchema.index({ user: 1, source: 1 }); // Filter by user and source
```

**Example Document:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "amount": 5000,
  "date": ISODate("2024-03-01T00:00:00.000Z"),
  "source": "Salary",
  "description": "Monthly salary from Company XYZ",
  "user": ObjectId("507f1f77bcf86cd799439011"),
  "createdAt": ISODate("2024-03-01T10:30:00.000Z"),
  "updatedAt": ISODate("2024-03-01T10:30:00.000Z")
}
```

**Validation:**
- `amount` must be a number (no min/max validation in schema)
- `source` must be one of the enum values
- `user` must be a valid ObjectId

---

### 3. expenses

**Purpose:** Store expense transaction records

**Schema Definition:** `server/models/Expense.js`

**Fields:**

| Field | Type | Required | Enum Values | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | - | MongoDB auto-generated ID |
| `amount` | Number | Yes | - | Expense amount (positive number) |
| `date` | Date | Yes | - | Date of expense transaction |
| `category` | String | Yes | Food, Utilities, Entertainment, Transportation, Others | Expense category |
| `description` | String | No | - | Optional notes about the expense |
| `user` | ObjectId | Yes | - | Reference to users collection |
| `createdAt` | Date | Auto | - | Record creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

**Relationships:**
- `user` field references `users._id` (many-to-one)

**Recommended Indexes (not currently implemented):**
```javascript
ExpenseSchema.index({ user: 1, date: -1 }); // Query by user, sort by date
ExpenseSchema.index({ user: 1, category: 1 }); // Filter by user and category
ExpenseSchema.index({ category: 1 }); // Aggregate by category
```

**Example Document:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "amount": 150.50,
  "date": ISODate("2024-03-02T00:00:00.000Z"),
  "category": "Food",
  "description": "Weekly groceries at Walmart",
  "user": ObjectId("507f1f77bcf86cd799439011"),
  "createdAt": ISODate("2024-03-02T09:15:00.000Z"),
  "updatedAt": ISODate("2024-03-02T09:15:00.000Z")
}
```

**Validation:**
- `amount` must be a number (no min/max validation in schema)
- `category` must be one of the enum values
- `user` must be a valid ObjectId

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│       users         │
│─────────────────────│
│ _id (PK)            │
│ username (unique)   │
│ email (unique)      │
│ password (hashed)   │
│ createdAt           │
│ updatedAt           │
└──────────┬──────────┘
           │
           │ 1
           │
           │
     ┌─────┴─────┐
     │           │
     │ many      │ many
     │           │
┌────▼─────┐  ┌──▼──────────┐
│ incomes  │  │  expenses   │
│──────────│  │─────────────│
│ _id (PK) │  │ _id (PK)    │
│ amount   │  │ amount      │
│ date     │  │ date        │
│ source   │  │ category    │
│ desc     │  │ desc        │
│ user (FK)│  │ user (FK)   │
│ created  │  │ created     │
│ updated  │  │ updated     │
└──────────┘  └─────────────┘
```

**Relationships:**
- One User → Many Incomes (1:N)
- One User → Many Expenses (1:N)
- No direct relationship between Incomes and Expenses

---

## Common Queries

### User Operations

**Create User:**
```javascript
const user = new User({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'plaintext' // Will be hashed by pre-save hook
});
await user.save();
```

**Find User by Email:**
```javascript
const user = await User.findOne({ email: 'john@example.com' });
```

**Verify Password:**
```javascript
const isMatch = await user.comparePassword('plaintext');
```

### Income Operations

**Get All Income for User:**
```javascript
const incomes = await Income.find({ user: userId });
```

**Get Income Sorted by Date:**
```javascript
const incomes = await Income.find({ user: userId })
  .sort({ date: -1 });
```

**Get Total Income:**
```javascript
const result = await Income.aggregate([
  { $match: { user: mongoose.Types.ObjectId(userId) } },
  { $group: { _id: null, total: { $sum: '$amount' } } }
]);
const totalIncome = result[0]?.total || 0;
```

**Get Income by Source:**
```javascript
const salaryIncome = await Income.find({
  user: userId,
  source: 'Salary'
});
```

### Expense Operations

**Get All Expenses for User:**
```javascript
const expenses = await Expense.find({ user: userId });
```

**Get Expenses by Category:**
```javascript
const foodExpenses = await Expense.find({
  user: userId,
  category: 'Food'
});
```

**Get Total Expenses:**
```javascript
const result = await Expense.aggregate([
  { $match: { user: mongoose.Types.ObjectId(userId) } },
  { $group: { _id: null, total: { $sum: '$amount' } } }
]);
const totalExpenses = result[0]?.total || 0;
```

**Get Expenses by Category (Aggregated):**
```javascript
const categoryTotals = await Expense.aggregate([
  { $match: { user: mongoose.Types.ObjectId(userId) } },
  { $group: {
      _id: '$category',
      totalSpent: { $sum: '$amount' },
      count: { $sum: 1 }
    }
  },
  { $sort: { totalSpent: -1 } }
]);
```

### Dashboard Queries

**Get Recent Transactions:**
```javascript
const recentIncome = await Income.find({ user: userId })
  .sort({ date: -1 })
  .limit(5);

const recentExpenses = await Expense.find({ user: userId })
  .sort({ date: -1 })
  .limit(5);

const allTransactions = [...recentIncome, ...recentExpenses]
  .sort((a, b) => b.date - a.date);
```

**Get Net Balance:**
```javascript
const [incomeResult] = await Income.aggregate([
  { $match: { user: mongoose.Types.ObjectId(userId) } },
  { $group: { _id: null, total: { $sum: '$amount' } } }
]);

const [expenseResult] = await Expense.aggregate([
  { $match: { user: mongoose.Types.ObjectId(userId) } },
  { $group: { _id: null, total: { $sum: '$amount' } } }
]);

const netBalance = (incomeResult?.total || 0) - (expenseResult?.total || 0);
```

---

## Data Integrity

### Current State

**Enforced:**
- Required fields (Mongoose validation)
- Unique constraints (email, username)
- Enum validation (source, category)
- ObjectId references (user field)
- Automatic timestamps

**Not Enforced:**
- Positive amount validation (can be negative or zero)
- Date range validation (can be future dates)
- Description length limits
- Referential integrity (can reference non-existent user)
- Cascade delete (deleting user doesn't delete their transactions)

### Recommended Improvements

**Add Validation:**
```javascript
amount: {
  type: Number,
  required: true,
  min: [0.01, 'Amount must be positive']
},

description: {
  type: String,
  maxlength: [500, 'Description too long']
}
```

**Add Referential Integrity:**
```javascript
// In User model
UserSchema.pre('remove', async function(next) {
  await Income.deleteMany({ user: this._id });
  await Expense.deleteMany({ user: this._id });
  next();
});
```

**Add Indexes:**
```javascript
// In Income and Expense models
schema.index({ user: 1, date: -1 });
schema.index({ user: 1, createdAt: -1 });
```

---

## Performance Considerations

### Current Issues

1. **No Indexes:** Only default _id index exists
   - Queries by user are slow for large datasets
   - Sorting by date is inefficient

2. **No Pagination:** All records loaded at once
   - Memory issues with many transactions
   - Slow response times

3. **Inefficient Aggregations:** Dashboard runs multiple queries
   - Could be combined into single aggregation pipeline

### Optimization Strategies

**Add Compound Indexes:**
```javascript
// Most common query pattern
IncomeSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ user: 1, date: -1 });

// For category filtering
ExpenseSchema.index({ user: 1, category: 1 });
```

**Implement Pagination:**
```javascript
const page = 1;
const limit = 20;
const skip = (page - 1) * limit;

const expenses = await Expense.find({ user: userId })
  .sort({ date: -1 })
  .skip(skip)
  .limit(limit);

const total = await Expense.countDocuments({ user: userId });
```

**Optimize Dashboard Query:**
```javascript
// Single aggregation instead of multiple queries
const stats = await Expense.aggregate([
  { $match: { user: mongoose.Types.ObjectId(userId) } },
  {
    $facet: {
      totalExpense: [
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ],
      byCategory: [
        { $group: { _id: '$category', total: { $sum: '$amount' } } }
      ],
      recent: [
        { $sort: { date: -1 } },
        { $limit: 5 }
      ]
    }
  }
]);
```

---

## Migration Considerations

If you need to modify the schema in production:

**Adding New Field:**
```javascript
// Add field with default value
ExpenseSchema.add({
  tags: {
    type: [String],
    default: []
  }
});
```

**Changing Field Type:**
```javascript
// Requires data migration script
db.expenses.find().forEach(function(doc) {
  db.expenses.update(
    { _id: doc._id },
    { $set: { amount: NumberDecimal(doc.amount.toString()) } }
  );
});
```

**Adding Index:**
```javascript
// Can be done without downtime
db.expenses.createIndex({ user: 1, date: -1 });
```

---

## Backup and Recovery

**Backup Command:**
```bash
mongodump --db expense_tracker --out /backup/path
```

**Restore Command:**
```bash
mongorestore --db expense_tracker /backup/path/expense_tracker
```

**Automated Backup (MongoDB Atlas):**
- Continuous backups with point-in-time recovery
- Scheduled snapshots
- Cross-region replication
