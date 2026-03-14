# API Overview

Complete reference for all backend API endpoints.

## Base URL

```
Development: http://localhost:5000
Production: [Your deployed backend URL]
```

## Authentication

Most endpoints require JWT authentication.

**Header Format:**
```
Authorization: Bearer <jwt_token>
```

**Token Acquisition:**
- Obtain token from `/users/login` or `/users/register` endpoints
- Token expires after 1 hour
- Store token in localStorage on client-side

---

## User Endpoints

### Register User

**Endpoint:** `POST /users/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully"
}
```

**Error Responses:**
- `400` - User already exists
- `500` - Failed to register user

**Notes:**
- Password is automatically hashed with bcrypt before storage
- Email and username must be unique
- Backend does not return token on registration (client must login separately)

---

### Login User

**Endpoint:** `POST /users/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Token Payload (decoded):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "iat": 1234567890,
  "exp": 1234571490
}
```

**Error Responses:**
- `400` - Invalid credentials (wrong email or password)
- `500` - Failed to login user

**Notes:**
- Returns JWT token valid for 1 hour
- Client should decode token to extract user info (id, username)
- Token must be included in Authorization header for protected routes

---

## Income Endpoints

### Get All Income

**Endpoint:** `GET /income/:userId`

**Authentication:** Required

**URL Parameters:**
- `userId` - MongoDB ObjectId of the user

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "amount": 5000,
    "date": "2024-03-01T00:00:00.000Z",
    "source": "Salary",
    "description": "Monthly salary",
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2024-03-01T10:30:00.000Z",
    "updatedAt": "2024-03-01T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "amount": 1500,
    "date": "2024-03-05T00:00:00.000Z",
    "source": "Freelance",
    "description": "Web development project",
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2024-03-05T14:20:00.000Z",
    "updatedAt": "2024-03-05T14:20:00.000Z"
  }
]
```

**Error Responses:**
- `401` - Authorization required / Invalid token
- `500` - Failed to fetch income

**Notes:**
- Returns all income entries for the specified user
- No pagination (returns all records)
- Sorted by default MongoDB order (not explicitly sorted)

---

### Add Income

**Endpoint:** `POST /income/add`

**Authentication:** Required

**Request Body:**
```json
{
  "amount": 5000,
  "date": "2024-03-01",
  "source": "Salary",
  "description": "Monthly salary"
}
```

**Field Constraints:**
- `amount` - Number, required, should be positive
- `date` - Date, required
- `source` - String, required, must be one of: "Salary", "Freelance", "Investments", "Others"
- `description` - String, optional

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "amount": 5000,
  "date": "2024-03-01T00:00:00.000Z",
  "source": "Salary",
  "description": "Monthly salary",
  "user": "507f1f77bcf86cd799439012",
  "createdAt": "2024-03-01T10:30:00.000Z",
  "updatedAt": "2024-03-01T10:30:00.000Z"
}
```

**Error Responses:**
- `401` - Authorization required / Invalid token
- `500` - Failed to add income

**Notes:**
- User ID is extracted from JWT token (not from request body)
- Returns the created income document

---

### Update Income

**Endpoint:** `PUT /income/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - MongoDB ObjectId of the income entry

**Request Body:**
```json
{
  "amount": 5500,
  "date": "2024-03-01",
  "source": "Salary",
  "description": "Monthly salary (updated)"
}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "amount": 5500,
  "date": "2024-03-01T00:00:00.000Z",
  "source": "Salary",
  "description": "Monthly salary (updated)",
  "user": "507f1f77bcf86cd799439012",
  "createdAt": "2024-03-01T10:30:00.000Z",
  "updatedAt": "2024-03-01T15:45:00.000Z"
}
```

**Error Responses:**
- `401` - Authorization required / Invalid token
- `404` - Income not found
- `500` - Failed to edit income

**Security Issue:**
- No ownership verification (user A can edit user B's income if they know the ID)

---

### Delete Income

**Endpoint:** `DELETE /income/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - MongoDB ObjectId of the income entry

**Success Response (200):**
```json
{
  "message": "Income deleted successfully"
}
```

**Error Responses:**
- `401` - Authorization required / Invalid token
- `404` - Income not found
- `500` - Failed to delete income

**Security Issue:**
- No ownership verification (user A can delete user B's income if they know the ID)

---

## Expense Endpoints

### Get All Expenses

**Endpoint:** `GET /expenses/:userId`

**Authentication:** Required

**URL Parameters:**
- `userId` - MongoDB ObjectId of the user

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "amount": 150,
    "date": "2024-03-02T00:00:00.000Z",
    "category": "Food",
    "description": "Groceries",
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2024-03-02T09:15:00.000Z",
    "updatedAt": "2024-03-02T09:15:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439015",
    "amount": 80,
    "date": "2024-03-03T00:00:00.000Z",
    "category": "Transportation",
    "description": "Gas",
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2024-03-03T11:20:00.000Z",
    "updatedAt": "2024-03-03T11:20:00.000Z"
  }
]
```

**Error Responses:**
- `401` - Authorization required / Invalid token
- `500` - Failed to fetch expenses

---

### Add Expense

**Endpoint:** `POST /expenses/add`

**Authentication:** Required

**Request Body:**
```json
{
  "amount": 150,
  "date": "2024-03-02",
  "category": "Food",
  "description": "Groceries"
}
```

**Field Constraints:**
- `amount` - Number, required, should be positive
- `date` - Date, required
- `category` - String, required, must be one of: "Food", "Utilities", "Entertainment", "Transportation", "Others"
- `description` - String, optional

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "amount": 150,
  "date": "2024-03-02T00:00:00.000Z",
  "category": "Food",
  "description": "Groceries",
  "user": "507f1f77bcf86cd799439012",
  "createdAt": "2024-03-02T09:15:00.000Z",
  "updatedAt": "2024-03-02T09:15:00.000Z"
}
```

**Error Responses:**
- `401` - Authorization required / Invalid token
- `500` - Failed to add expense

---

### Update Expense

**Endpoint:** `PUT /expenses/edit/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - MongoDB ObjectId of the expense entry

**Request Body:**
```json
{
  "amount": 175,
  "date": "2024-03-02",
  "category": "Food",
  "description": "Groceries (updated)"
}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "amount": 175,
  "date": "2024-03-02T00:00:00.000Z",
  "category": "Food",
  "description": "Groceries (updated)",
  "user": "507f1f77bcf86cd799439012",
  "createdAt": "2024-03-02T09:15:00.000Z",
  "updatedAt": "2024-03-02T16:30:00.000Z"
}
```

**Error Responses:**
- `401` - Authorization required / Invalid token
- `404` - Expense not found
- `500` - Failed to edit expense

**Note:** URL pattern is `/edit/:id` (inconsistent with income which uses `/:id`)

---

### Delete Expense

**Endpoint:** `DELETE /expenses/delete/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - MongoDB ObjectId of the expense entry

**Success Response (200):**
```json
{
  "message": "Expense deleted successfully"
}
```

**Error Responses:**
- `401` - Authorization required / Invalid token
- `404` - Expense not found
- `500` - Failed to delete expense

**Note:** URL pattern is `/delete/:id` (inconsistent with income which uses `/:id`)

---

## Dashboard Endpoints

**Note:** These routes are defined but NOT connected in server.js. They won't work until you add:
```javascript
app.use('/dashboard', dashboardRoutes);
```

### Get Dashboard Overview

**Endpoint:** `GET /dashboard/overview`

**Authentication:** Should be required (not currently implemented)

**Query Parameters:**
- `userId` - Should be passed as query param or extracted from JWT

**Expected Response (200):**
```json
{
  "totalIncome": 15000,
  "totalExpense": 8500,
  "netBalance": 6500
}
```

**Notes:**
- Aggregates ALL income and expenses across ALL users (bug)
- Should filter by userId
- No authentication middleware applied

---

### Get Recent Transactions

**Endpoint:** `GET /dashboard/recent-transactions`

**Authentication:** Should be required (not currently implemented)

**Expected Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "amount": 5000,
    "date": "2024-03-05T00:00:00.000Z",
    "source": "Salary",
    "description": "Monthly salary",
    "user": "507f1f77bcf86cd799439012",
    "type": "income"
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "amount": 150,
    "date": "2024-03-04T00:00:00.000Z",
    "category": "Food",
    "description": "Groceries",
    "user": "507f1f77bcf86cd799439012",
    "type": "expense"
  }
]
```

**Notes:**
- Fetches 5 most recent income + 5 most recent expenses
- Merges and sorts by date
- Returns ALL users' transactions (bug - should filter by userId)
- Response doesn't include "type" field (frontend infers from source/category presence)

---

### Get Budget Status

**Endpoint:** `GET /dashboard/budget-status`

**Authentication:** Should be required (not currently implemented)

**Expected Response (200):**
```json
[
  {
    "category": "Food",
    "totalSpent": 450
  },
  {
    "category": "Utilities",
    "totalSpent": 200
  },
  {
    "category": "Entertainment",
    "totalSpent": 150
  },
  {
    "category": "Transportation",
    "totalSpent": 300
  },
  {
    "category": "Others",
    "totalSpent": 100
  }
]
```

**Notes:**
- Aggregates expenses by category
- Returns ALL users' expenses (bug - should filter by userId)
- Frontend expects field name "spent" but backend returns "totalSpent"

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (validation errors, user exists)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (database errors, unexpected errors)

---

## API Inconsistencies

### URL Patterns

**Income:**
- GET `/income/:userId`
- POST `/income/add`
- PUT `/income/:id`
- DELETE `/income/:id`

**Expenses:**
- GET `/expenses/:userId`
- POST `/expenses/add`
- PUT `/expenses/edit/:id` ← Inconsistent
- DELETE `/expenses/delete/:id` ← Inconsistent

**Recommendation:** Standardize to RESTful patterns:
- GET `/income` (extract userId from JWT)
- POST `/income`
- PUT `/income/:id`
- DELETE `/income/:id`

### Field Names

**Dashboard Response:**
- Backend returns: `totalIncome`, `totalExpense`, `totalSpent`
- Frontend expects: `totalIncome`, `totalExpenses`, `spent`

### User Filtering

**Current:** userId passed as URL parameter
**Issue:** Any authenticated user can access any other user's data
**Fix:** Extract userId from JWT token, don't accept it as parameter

---

## Security Recommendations

1. **Add ownership verification** to update/delete operations
2. **Remove userId from URL parameters**, use JWT token instead
3. **Add input validation** with express-validator
4. **Implement rate limiting** to prevent brute force attacks
5. **Use environment variables** for JWT secret
6. **Add refresh token** mechanism
7. **Implement token blacklisting** on logout
8. **Add request logging** for audit trail
9. **Sanitize inputs** to prevent injection attacks
10. **Add HTTPS enforcement** in production

---

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"pass123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

**Add Income (with token):**
```bash
curl -X POST http://localhost:5000/income/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"amount":5000,"date":"2024-03-01","source":"Salary","description":"Monthly"}'
```

### Using Postman

1. Create a new request
2. Set method and URL
3. Add headers: `Content-Type: application/json`, `Authorization: Bearer <token>`
4. Add JSON body
5. Send request

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request
3. Configure method, URL, headers, body
4. Save to collection for reuse
