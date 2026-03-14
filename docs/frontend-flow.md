# Frontend Flow

This document details the React frontend architecture, component structure, state management, and data flow patterns.

## Component Architecture

### Component Hierarchy

```
App
├── BrowserRouter
│   └── AuthProvider (Context)
│       └── AppRoutes
│           ├── Public Routes
│           │   ├── /login → Login (AuthLayout)
│           │   └── /register → Register (AuthLayout)
│           │
│           └── Protected Routes (ProtectedRoute wrapper)
│               ├── /dashboard → Dashboard (MainLayout)
│               ├── /income → Income (MainLayout)
│               └── /expenses → Expenses (MainLayout)
```

### Layout Components

**AuthLayout** (for Login/Register):
```
┌─────────────────────────────────────┐
│                                     │
│         [Logo/Branding]             │
│                                     │
│     ┌─────────────────────┐         │
│     │                     │         │
│     │   {children}        │         │
│     │   (Login/Register)  │         │
│     │                     │         │
│     └─────────────────────┘         │
│                                     │
└─────────────────────────────────────┘
```

**MainLayout** (for Dashboard/Income/Expenses):
```
┌──────────┬──────────────────────────┐
│          │  Title                   │
│ Sidebar  │  Subtitle                │
│          ├──────────────────────────┤
│ [Links]  │                          │
│          │                          │
│ • Dash   │   {children}             │
│ • Income │   (Page Content)         │
│ • Expense│                          │
│          │                          │
│ [User]   │                          │
│ Logout   │                          │
└──────────┴──────────────────────────┘
```

## State Management

### Global State (AuthContext)

**Location:** `client/src/context/AuthContext.js`

**State Variables:**
```javascript
{
  user: { _id: string, username: string } | null,
  loading: boolean,
  error: string | null
}
```

**Methods:**
```javascript
{
  login: async (email, password) => { success, error },
  register: async (username, email, password) => { success, error },
  logout: () => void,
  clearError: () => void
}
```

**Computed Values:**
```javascript
{
  isAuthenticated: !!user
}
```

**Usage Pattern:**
```javascript
// In any component
import { useAuth } from '../context';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Use authentication state and methods
};
```

### Local State Patterns

**Page-Level State (Dashboard example):**
```javascript
const [overview, setOverview] = useState(null);
const [transactions, setTransactions] = useState([]);
const [budgetStatus, setBudgetStatus] = useState([]);
const [loading, setLoading] = useState(true);
```

**Form State (TransactionForm):**
```javascript
const [formData, setFormData] = useState({
  amount: '',
  date: formatDateInput(new Date()),
  description: '',
  source: '', // or category for expenses
});
```

**Modal State (Income/Expenses pages):**
```javascript
const [showModal, setShowModal] = useState(false);
const [editingTransaction, setEditingTransaction] = useState(null);
const [loading, setLoading] = useState(false);
```

## Data Fetching Patterns

### Initial Data Load

**Pattern:** useEffect with dependency array

```javascript
useEffect(() => {
  const fetchData = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      const data = await incomeService.getIncome(user._id);
      setIncomes(data);
    } catch (error) {
      console.error('Failed to fetch income:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, [user]);
```

### Parallel Data Fetching

**Pattern:** Promise.all for multiple API calls

```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      const [overviewData, transactionsData, budgetData] = await Promise.all([
        dashboardService.getOverview(user._id),
        dashboardService.getRecentTransactions(user._id),
        dashboardService.getBudgetStatus(user._id),
      ]);
      
      setOverview(overviewData);
      setTransactions(transactionsData.transactions || []);
      setBudgetStatus(budgetData.budgetStatus || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, [user]);
```

### CRUD Operations

**Add Transaction:**
```javascript
const handleAdd = async (formData) => {
  try {
    setLoading(true);
    await incomeService.addIncome(formData);
    setShowModal(false);
    // Refresh list
    const data = await incomeService.getIncome(user._id);
    setIncomes(data);
  } catch (error) {
    console.error('Failed to add income:', error);
  } finally {
    setLoading(false);
  }
};
```

**Edit Transaction:**
```javascript
const handleEdit = async (formData) => {
  try {
    setLoading(true);
    await incomeService.updateIncome(editingTransaction._id, formData);
    setShowModal(false);
    setEditingTransaction(null);
    // Refresh list
    const data = await incomeService.getIncome(user._id);
    setIncomes(data);
  } catch (error) {
    console.error('Failed to update income:', error);
  } finally {
    setLoading(false);
  }
};
```

**Delete Transaction:**
```javascript
const handleDelete = async (id) => {
  try {
    await incomeService.deleteIncome(id);
    // Optimistic update
    setIncomes(incomes.filter(income => income._id !== id));
  } catch (error) {
    console.error('Failed to delete income:', error);
    // Refresh on error
    const data = await incomeService.getIncome(user._id);
    setIncomes(data);
  }
};
```

## Routing

### Route Configuration

**Public Routes:**
```javascript
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
```

**Protected Routes:**
```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### ProtectedRoute Implementation

```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <Spinner />;
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
```

### Navigation Patterns

**Programmatic Navigation:**
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/dashboard'); // After login
```

**Link Navigation:**
```javascript
import { NavLink } from 'react-router-dom';

<NavLink to="/dashboard">Dashboard</NavLink>
```

## Form Handling

### Controlled Components

**Input Binding:**
```javascript
const [formData, setFormData] = useState({ email: '', password: '' });

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

<Input
  name="email"
  value={formData.email}
  onChange={handleChange}
/>
```

### Form Submission

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!formData.amount || !formData.date) {
    return;
  }
  
  // Transform data
  const payload = {
    ...formData,
    amount: parseFloat(formData.amount),
  };
  
  // Submit
  await onSubmit(payload);
};
```

### Form Validation

**Client-Side Validation:**
- HTML5 attributes: `required`, `min`, `max`, `type="email"`
- Custom validation in handleSubmit
- Error state display

```javascript
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  
  if (!formData.email.includes('@')) {
    newErrors.email = 'Invalid email';
  }
  
  if (formData.password.length < 6) {
    newErrors.password = 'Password too short';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Conditional Rendering

### Loading States

```javascript
{loading ? (
  <LoadingWrapper>
    <Spinner size="lg" />
  </LoadingWrapper>
) : (
  <Content />
)}
```

### Empty States

```javascript
{transactions.length > 0 ? (
  <Table>
    {/* Render transactions */}
  </Table>
) : (
  <EmptyState>
    No transactions yet. Start by adding income or expenses!
  </EmptyState>
)}
```

### Conditional Content

```javascript
{isAuthenticated && (
  <UserMenu>
    <span>{user.username}</span>
    <button onClick={logout}>Logout</button>
  </UserMenu>
)}
```

## Event Handling

### Button Clicks

```javascript
<Button onClick={() => setShowModal(true)}>
  Add Income
</Button>
```

### Form Events

```javascript
<form onSubmit={handleSubmit}>
  <Input onChange={handleChange} />
  <Button type="submit">Submit</Button>
</form>
```

### Modal Events

```javascript
<Modal
  isOpen={showModal}
  onClose={() => {
    setShowModal(false);
    setEditingTransaction(null);
  }}
>
  <TransactionForm
    onSubmit={handleAdd}
    onCancel={() => setShowModal(false)}
  />
</Modal>
```

## Styling Patterns

### Styled Components

**Component Definition:**
```javascript
const StyledButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  &:hover {
    opacity: 0.9;
  }
`;
```

**Dynamic Styling:**
```javascript
const Badge = styled.span`
  background: ${({ variant, theme }) =>
    variant === 'success' ? theme.colors.income : theme.colors.expense};
`;

<Badge variant="success">Income</Badge>
```

### Theme Access

```javascript
import { ThemeProvider } from 'styled-components';
import { theme } from './styles';

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

## Data Visualization

### Chart.js Integration

**Chart Registration:**
```javascript
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
```

**Doughnut Chart:**
```javascript
const doughnutData = {
  labels: budgetStatus.map((item) => item.category),
  datasets: [{
    data: budgetStatus.map((item) => item.spent),
    backgroundColor: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
    borderWidth: 0,
  }],
};

<Doughnut data={doughnutData} options={chartOptions} />
```

**Bar Chart:**
```javascript
const barData = {
  labels: budgetStatus.map((item) => item.category),
  datasets: [{
    label: 'Spent',
    data: budgetStatus.map((item) => item.spent),
    backgroundColor: chartColors,
    borderRadius: 8,
  }],
};

<Bar data={barData} options={barOptions} />
```

## API Integration

### Axios Configuration

**Base Setup:**
```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});
```

**Request Interceptor:**
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor:**
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Service Layer

**Service Structure:**
```javascript
export const incomeService = {
  async getIncome(userId) {
    const response = await api.get(`/income/${userId}`);
    return response.data;
  },
  
  async addIncome(data) {
    const response = await api.post('/income/add', data);
    return response.data;
  },
  
  async updateIncome(id, data) {
    const response = await api.put(`/income/${id}`, data);
    return response.data;
  },
  
  async deleteIncome(id) {
    const response = await api.delete(`/income/${id}`);
    return response.data;
  },
};
```

## Performance Considerations

**Implemented:**
- useEffect dependency arrays to prevent unnecessary re-renders
- Conditional rendering to avoid rendering hidden components
- Promise.all for parallel API calls

**Potential Improvements:**
- React.memo for expensive components
- useMemo for expensive calculations
- useCallback for stable function references
- Pagination for large transaction lists
- Debouncing for search/filter inputs
- Code splitting with React.lazy
- Virtual scrolling for long lists
