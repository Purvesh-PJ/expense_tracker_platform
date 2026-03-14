# Modules and Components

This document provides a detailed breakdown of the project's folder structure, key modules, and their responsibilities.

## Frontend Structure (`client/src/`)

### 1. Pages (`pages/`)
**Purpose:** Top-level route components that represent full pages

**Files:**
- `Dashboard.js` - Main analytics page with charts and recent transactions
- `Income.js` - Income management page with add/edit/delete functionality
- `Expenses.js` - Expense management page with add/edit/delete functionality
- `Login.js` - User authentication page
- `Register.js` - User registration page
- `index.js` - Barrel export for all pages

**Characteristics:**
- Each page is a complete view with its own data fetching
- Uses MainLayout or AuthLayout for consistent structure
- Manages local state for modals, forms, loading states
- Calls service layer for API interactions

### 2. Components (`components/`)

#### Base Components (`components/base/`)
**Purpose:** Reusable, styled UI primitives

**Files:**
- `Button.js` - Styled button with variants (primary, secondary, ghost, danger)
- `Card.js` - Container component with header, title, content sections
- `Input.js` - Form input with label and validation styling
- `Select.js` - Dropdown select with options
- `Table.js` - Data table with thead, tbody, tr, th, td components
- `Modal.js` - Overlay modal with backdrop and close functionality
- `Badge.js` - Status indicator with color variants (success, danger, warning)
- `Spinner.js` - Loading indicator with size variants
- `Typography.js` - Text components (Heading, Text) with styling props
- `index.js` - Barrel export for all base components

**Design System:**
- All components use styled-components
- Access theme via props (colors, spacing, typography)
- Consistent API across components (variant, size, disabled props)
- Accessibility considerations (semantic HTML, ARIA attributes)

#### Layout Components (`components/layout/`)
**Purpose:** Page structure and navigation

**Files:**
- `MainLayout.js` - Authenticated page wrapper with sidebar and content area
- `AuthLayout.js` - Unauthenticated page wrapper (login/register)
- `Sidebar.js` - Navigation menu with links and user info
- `index.js` - Barrel export

**Responsibilities:**
- MainLayout: Provides sidebar navigation, page title, subtitle
- AuthLayout: Centers content, provides branding
- Sidebar: Shows navigation links, active state, logout button

#### Feature Components (`components/`)
**Purpose:** Specialized components for specific features

**Files:**
- `TransactionForm.js` - Reusable form for adding/editing income and expenses
- `ProtectedRoute.js` - Route wrapper that enforces authentication

**TransactionForm Details:**
- Accepts `type` prop ('income' or 'expense')
- Dynamically shows source (income) or category (expense) dropdown
- Handles both add mode (empty form) and edit mode (pre-filled)
- Validates required fields (amount, date, source/category)
- Emits onSubmit and onCancel events

### 3. Context (`context/`)
**Purpose:** Global state management

**Files:**
- `AuthContext.js` - Authentication state and methods
- `index.js` - Barrel export

**AuthContext API:**
```javascript
{
  user: { _id, username } | null,
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean,
  login: (email, password) => Promise,
  register: (username, email, password) => Promise,
  logout: () => void,
  clearError: () => void
}
```

**Responsibilities:**
- Manages JWT token in localStorage
- Decodes token to extract user info
- Provides authentication methods to entire app
- Handles token expiration on mount
- Redirects after login/logout

### 4. Services (`services/`)
**Purpose:** API integration layer (abstraction over axios)

**Files:**
- `api.js` - Axios instance with interceptors
- `authService.js` - Login and register API calls
- `incomeService.js` - Income CRUD operations
- `expenseService.js` - Expense CRUD operations
- `dashboardService.js` - Dashboard data aggregation calls
- `index.js` - Barrel export

**api.js Features:**
- Base URL configuration (defaults to localhost:5000)
- Request interceptor: Automatically adds JWT token to headers
- Response interceptor: Handles 401 errors (auto-logout)
- Centralized error handling

**Service Pattern:**
```javascript
export const incomeService = {
  async getIncome(userId) {
    const response = await api.get(`/income/${userId}`);
    return response.data;
  },
  // ... other methods
};
```

### 5. Styles (`styles/`)
**Purpose:** Global styling and theme configuration

**Files:**
- `GlobalStyles.js` - CSS reset and global styles
- `theme.js` - Design tokens (colors, spacing, typography, breakpoints)
- `index.js` - Barrel export

**Theme Structure:**
```javascript
{
  colors: {
    primary, secondary, income, expense,
    neutral: { 0, 50, 100, ..., 900 },
    text: { primary, secondary, disabled }
  },
  spacing: { 1: '4px', 2: '8px', ..., 12: '48px' },
  typography: {
    fontSize: { xs, sm, base, lg, xl, 2xl, 3xl },
    fontWeight: { normal, medium, semibold, bold }
  },
  borderRadius: { sm, md, lg, xl, full },
  shadows: { card, modal },
  breakpoints: { sm, md, lg, xl }
}
```

### 6. Utils (`utils/`)
**Purpose:** Helper functions

**Files:**
- `formatters.js` - Currency and date formatting utilities
- `index.js` - Barrel export

**Functions:**
- `formatCurrency(amount)` - Formats number as USD currency
- `formatDate(date)` - Formats date as readable string
- `formatDateInput(date)` - Formats date for input[type="date"]

### 7. Routes (`routes/`)
**Purpose:** Route configuration

**Files:**
- `AppRoutes.js` (assumed) - Defines all application routes
- Public routes: /login, /register
- Protected routes: /dashboard, /income, /expenses

### 8. Entry Point
**Files:**
- `index.js` - React app entry point, renders App into DOM
- `App.js` - Root component with BrowserRouter and AuthProvider

---

## Backend Structure (`server/`)

### 1. Models (`models/`)
**Purpose:** MongoDB schema definitions

**Files:**
- `User.js` - User account schema with password hashing
- `Income.js` - Income transaction schema
- `Expense.js` - Expense transaction schema

**User Model:**
- Fields: username, email, password, timestamps
- Pre-save hook: Hashes password with bcrypt
- Method: comparePassword() for login verification

**Income Model:**
- Fields: amount, date, source (enum), description, user (ref)
- Source options: Salary, Freelance, Investments, Others

**Expense Model:**
- Fields: amount, date, category (enum), description, user (ref)
- Category options: Food, Utilities, Entertainment, Transportation, Others

### 2. Controllers (`controllers/`)
**Purpose:** Business logic and request handling

**Files:**
- `UserControllers.js` - Registration and login logic
- `IncomeControllers.js` - Income CRUD operations
- `ExpenseControllers.js` - Expense CRUD operations
- `DashboardControllers.js` - Dashboard data aggregation

**Controller Pattern:**
```javascript
const addIncome = async (req, res) => {
  try {
    const { amount, date, source, description } = req.body;
    const userId = req.userId; // From middleware
    
    const newIncome = new IncomeModel({ amount, date, source, description, user: userId });
    await newIncome.save();
    
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add income' });
  }
};
```

**Dashboard Controller Features:**
- `getDashboardOverview()` - Aggregates total income, expenses, net balance
- `getRecentTransactions()` - Fetches and merges recent income + expenses
- `getBudgetStatus()` - Aggregates expenses by category

### 3. Routes (`routes/`)
**Purpose:** API endpoint definitions

**Files:**
- `UserRoutes.js` - /users/register, /users/login
- `IncomeRoutes.js` - /income/* endpoints
- `ExpensesRoutes.js` - /expenses/* endpoints
- `DashboardRoutes.js` - /dashboard/* endpoints (not connected in server.js)

**Route Pattern:**
```javascript
router.post('/add', authenticate, addIncome);
router.get('/:userId', authenticate, getIncome);
router.put('/:id', authenticate, editIncome);
router.delete('/:id', authenticate, deleteIncome);
```

### 4. Middleware (`middleware/`)
**Purpose:** Request processing pipeline

**Files:**
- `authenticate.js` - JWT verification middleware

**Functionality:**
- Extracts token from Authorization header
- Verifies token with jwt.verify()
- Attaches userId to req object
- Returns 401 if token invalid/missing

### 5. Config (`config/`)
**Purpose:** Application configuration

**Files:**
- `db.js` - MongoDB connection setup

**Functionality:**
- Connects to MongoDB using mongoose.connect()
- Uses connection string from environment variable or default
- Handles connection errors

### 6. Entry Point
**Files:**
- `server.js` - Express app setup and server start

**Responsibilities:**
- Initialize Express app
- Connect to database
- Configure middleware (CORS, JSON parsing)
- Register routes
- Start server on port 5000

---

## Module Connections

### Frontend Data Flow
```
Page Component
    ↓ (calls)
Service Layer
    ↓ (uses)
API Client (axios)
    ↓ (HTTP request)
Backend API
```

### Backend Request Flow
```
Express Router
    ↓ (matches route)
Middleware (authenticate)
    ↓ (verifies JWT)
Controller
    ↓ (business logic)
Model
    ↓ (Mongoose query)
MongoDB
```

### Authentication Flow
```
AuthContext (global state)
    ↓ (provides)
useAuth() hook
    ↓ (used by)
Components (Login, ProtectedRoute, Sidebar)
    ↓ (calls)
authService
    ↓ (API request)
UserControllers
```

---

## Key Design Patterns

**Frontend:**
- **Container/Presentational:** Pages (containers) use base components (presentational)
- **Service Layer:** Abstracts API calls from components
- **Context API:** Global state without prop drilling
- **Custom Hooks:** useAuth() for accessing authentication
- **Barrel Exports:** index.js files for cleaner imports

**Backend:**
- **MVC Pattern:** Models, Controllers, Routes separation
- **Middleware Chain:** Express middleware for cross-cutting concerns
- **Repository Pattern:** Mongoose models abstract database operations
- **Error Handling:** Try-catch in all controllers with consistent error responses

---

## Important Entry Points

**Frontend:**
- `client/src/index.js` - React app initialization
- `client/src/App.js` - Root component with providers
- `client/src/routes/AppRoutes.js` - Route configuration
- `client/src/context/AuthContext.js` - Global auth state

**Backend:**
- `server/server.js` - Express app and server startup
- `server/config/db.js` - Database connection
- `server/middleware/authenticate.js` - Auth verification
- `server/routes/*.js` - API endpoint definitions

**Configuration:**
- `client/package.json` - Frontend dependencies and scripts
- `server/package.json` - Backend dependencies and scripts
- `server/.env` (not in repo) - Environment variables
- `client/.env` (not in repo) - API URL configuration
