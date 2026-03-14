# Working Flow

This document describes the main end-to-end flows in the Expense Tracker application.

## 1. User Registration Flow

```
User Action: Fill registration form (username, email, password)
    ↓
UI Component: Register.js validates input
    ↓
Context: AuthContext.register() called
    ↓
Service: authService.register() → POST /users/register
    ↓
Backend: UserControllers.registerUser()
    ↓
Validation: Check if email already exists
    ↓
Model: User.pre('save') hook hashes password with bcrypt
    ↓
Database: Save new user document to MongoDB
    ↓
Response: { message: 'User registered successfully' }
    ↓
Auto-Login: AuthContext calls login() with same credentials
    ↓
JWT Token: Stored in localStorage
    ↓
Navigation: Redirect to /dashboard
    ↓
UI Update: User sees dashboard with empty state
```

## 2. User Login Flow

```
User Action: Enter email and password
    ↓
UI Component: Login.js form submission
    ↓
Context: AuthContext.login(email, password)
    ↓
Service: authService.login() → POST /users/login
    ↓
Backend: UserControllers.loginUser()
    ↓
Database: Find user by email
    ↓
Validation: User.comparePassword() verifies password with bcrypt
    ↓
JWT Generation: jwt.sign({ id, username }, secret, { expiresIn: '1h' })
    ↓
Response: { token: 'eyJhbGc...' }
    ↓
Client: Decode JWT to extract user info (id, username)
    ↓
Storage: Save token to localStorage
    ↓
Context: Update user state with decoded data
    ↓
Navigation: Redirect to /dashboard
    ↓
UI Update: Sidebar shows username, dashboard loads data
```

## 3. Protected Route Access Flow

```
User Action: Navigate to /dashboard or /income or /expenses
    ↓
Router: AppRoutes checks route configuration
    ↓
Component: ProtectedRoute wrapper checks authentication
    ↓
Context: useAuth() retrieves isAuthenticated status
    ↓
Decision:
    ├─ If authenticated → Render requested page
    └─ If not authenticated → Redirect to /login
```

## 4. Dashboard Data Loading Flow

```
Page Load: Dashboard.js mounts
    ↓
Effect Hook: useEffect runs on mount
    ↓
Parallel API Calls: Promise.all([...])
    ├─ dashboardService.getOverview(userId)
    ├─ dashboardService.getRecentTransactions(userId)
    └─ dashboardService.getBudgetStatus(userId)
    ↓
Backend Processing:
    ├─ Overview: Aggregate total income, total expenses, calculate net balance
    ├─ Transactions: Fetch recent 5 income + 5 expenses, sort by date
    └─ Budget: Aggregate expenses by category
    ↓
Response: JSON data returned to client
    ↓
State Update: setOverview(), setTransactions(), setBudgetStatus()
    ↓
UI Render:
    ├─ Stat cards show totals with icons
    ├─ Doughnut chart displays category breakdown
    ├─ Bar chart shows spending overview
    └─ Table lists recent transactions
```

## 5. Add Income Flow

```
User Action: Click "Add Income" button
    ↓
UI: Modal opens with TransactionForm (type='income')
    ↓
User Input: Fill amount, date, source, description
    ↓
Form Submission: handleSubmit() called
    ↓
Service: incomeService.addIncome(data) → POST /income/add
    ↓
Middleware: authenticate() extracts userId from JWT
    ↓
Controller: IncomeControllers.addIncome()
    ↓
Model: Create new Income document with user reference
    ↓
Database: Save to incomes collection
    ↓
Response: Return created income object
    ↓
Client: Close modal, refresh income list
    ↓
Service: incomeService.getIncome(userId) → GET /income/:userId
    ↓
UI Update: Table shows new income entry
    ↓
Dashboard: Totals automatically update on next visit
```

## 6. Add Expense Flow

```
User Action: Click "Add Expense" button
    ↓
UI: Modal opens with TransactionForm (type='expense')
    ↓
User Input: Fill amount, date, category, description
    ↓
Form Submission: handleSubmit() called
    ↓
Service: expenseService.addExpense(data) → POST /expenses/add
    ↓
Middleware: authenticate() extracts userId from JWT
    ↓
Controller: ExpenseControllers.addExpense()
    ↓
Model: Create new Expense document with user reference
    ↓
Database: Save to expenses collection
    ↓
Response: Return created expense object
    ↓
Client: Close modal, refresh expense list
    ↓
Service: expenseService.getExpenses(userId) → GET /expenses/:userId
    ↓
UI Update: Table shows new expense entry
    ↓
Dashboard: Charts and totals update on next visit
```

## 7. Edit Transaction Flow

```
User Action: Click edit icon on transaction row
    ↓
UI: Modal opens with TransactionForm pre-filled with existing data
    ↓
User Input: Modify fields (amount, date, category/source, description)
    ↓
Form Submission: handleSubmit() called with transaction ID
    ↓
Service: 
    ├─ Income: incomeService.updateIncome(id, data) → PUT /income/:id
    └─ Expense: expenseService.updateExpense(id, data) → PUT /expenses/edit/:id
    ↓
Middleware: authenticate() verifies JWT
    ↓
Controller: 
    ├─ IncomeControllers.editIncome()
    └─ ExpenseControllers.editExpense()
    ↓
Database: findByIdAndUpdate() with { new: true }
    ↓
Response: Return updated document
    ↓
Client: Close modal, refresh list
    ↓
UI Update: Table shows updated values
```

## 8. Delete Transaction Flow

```
User Action: Click delete icon on transaction row
    ↓
UI: Confirmation prompt (optional, depends on implementation)
    ↓
Service:
    ├─ Income: incomeService.deleteIncome(id) → DELETE /income/:id
    └─ Expense: expenseService.deleteExpense(id) → DELETE /expenses/delete/:id
    ↓
Middleware: authenticate() verifies JWT
    ↓
Controller:
    ├─ IncomeControllers.deleteIncome()
    └─ ExpenseControllers.deleteExpense()
    ↓
Database: findByIdAndDelete()
    ↓
Response: { message: 'Transaction deleted successfully' }
    ↓
Client: Remove from local state or refresh list
    ↓
UI Update: Transaction disappears from table
```

## 9. Logout Flow

```
User Action: Click logout button in sidebar
    ↓
Context: AuthContext.logout() called
    ↓
Storage: localStorage.removeItem('token')
    ↓
Context: setUser(null) clears user state
    ↓
Navigation: Redirect to /login
    ↓
UI Update: Login page displayed
```

## 10. Token Expiration Flow

```
Scenario: User makes API request with expired token
    ↓
Client: axios interceptor adds token to Authorization header
    ↓
Backend: authenticate() middleware verifies token
    ↓
JWT Verification: jwt.verify() throws error (token expired)
    ↓
Response: 401 Unauthorized { message: 'Invalid or expired token' }
    ↓
Client: axios response interceptor catches 401 error
    ↓
Action: 
    ├─ Remove token from localStorage
    ├─ Remove user from localStorage
    └─ Redirect to /login
    ↓
UI Update: User sees login page with session expired message
```

## 11. Chart Visualization Flow

```
Dashboard Load: budgetStatus data fetched
    ↓
Data Structure: [{ category: 'Food', spent: 500 }, ...]
    ↓
Chart Configuration:
    ├─ Doughnut Chart:
    │   ├─ labels: category names
    │   ├─ data: spent amounts
    │   └─ backgroundColor: predefined color array
    └─ Bar Chart:
        ├─ labels: category names
        ├─ datasets: [{ label: 'Spent', data: amounts }]
        └─ borderRadius: 8px for rounded bars
    ↓
Chart.js Rendering: Canvas element draws interactive chart
    ↓
User Interaction: Hover shows tooltips with exact values
```

## 12. Error Handling Flow

```
API Request Fails:
    ↓
Axios catches error
    ↓
Check Error Type:
    ├─ 401 Unauthorized → Auto-logout and redirect to login
    ├─ 400 Bad Request → Show validation error message
    ├─ 500 Server Error → Show generic error message
    └─ Network Error → Show "Unable to connect" message
    ↓
UI Update: Display error notification or toast
    ↓
User Action: Retry or fix input
```

## 13. Initial App Load Flow

```
Browser: Load index.html
    ↓
React: index.js renders <App />
    ↓
App.js: Wraps with BrowserRouter and AuthProvider
    ↓
AuthProvider: useEffect checks localStorage for token
    ↓
Decision:
    ├─ Token exists and valid → Decode and set user state
    └─ No token or expired → User state remains null
    ↓
Router: Evaluates current URL
    ↓
Route Matching:
    ├─ / → Redirect to /dashboard or /login
    ├─ /login → Show Login page
    ├─ /register → Show Register page
    └─ /dashboard, /income, /expenses → Check authentication
    ↓
UI Render: Display appropriate page
```

## Key Flow Characteristics

**Authentication-First:** All data operations require valid JWT token

**User-Scoped Data:** All income/expense queries filter by userId

**Optimistic UI:** Some operations update UI before server confirmation

**Error Recovery:** 401 errors trigger automatic logout and redirect

**Real-Time Balance:** Dashboard recalculates totals on every load (no caching)

**Form Reusability:** TransactionForm handles both add and edit modes

**Parallel Loading:** Dashboard fetches multiple data sources simultaneously
