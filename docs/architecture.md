# Architecture Overview

## System Type

This is a **full-stack MERN application** (MongoDB, Express, React, Node.js) designed as a personal finance management platform. Users can track income and expenses, visualize spending patterns, and monitor their financial health through an interactive dashboard.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                          │
│  React SPA (Port 3000)                                      │
│  - Styled Components for UI                                 │
│  - Chart.js for data visualization                          │
│  - React Router for navigation                              │
│  - Context API for state management                         │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST (axios)
                     │ JWT Bearer Token
┌────────────────────▼────────────────────────────────────────┐
│                        SERVER TIER                          │
│  Express.js API (Port 5000)                                 │
│  - RESTful endpoints                                        │
│  - JWT authentication middleware                            │
│  - CORS enabled for localhost:3000                          │
└────────────────────┬────────────────────────────────────────┘
                     │ Mongoose ODM
┌────────────────────▼────────────────────────────────────────┐
│                       DATABASE TIER                         │
│  MongoDB                                                    │
│  - Users collection                                         │
│  - Income collection                                        │
│  - Expenses collection                                      │
└─────────────────────────────────────────────────────────────┘
```

## Major Layers

### 1. Frontend Layer (React)
**Purpose:** User interface and client-side logic

**Key Components:**
- **Pages:** Dashboard, Income, Expenses, Login, Register
- **Components:** Reusable UI elements (Button, Card, Table, Modal, etc.)
- **Context:** AuthContext for global authentication state
- **Services:** API integration layer (authService, incomeService, expenseService, dashboardService)
- **Routing:** Protected routes with authentication guards

**Technology Stack:**
- React 18.3 with functional components and hooks
- Styled Components for CSS-in-JS styling
- Chart.js (react-chartjs-2) for data visualization
- React Router v6 for client-side routing
- Axios for HTTP requests
- jwt-decode for token parsing

### 2. Backend Layer (Node.js/Express)
**Purpose:** Business logic, data validation, and API endpoints

**Key Components:**
- **Routes:** Define API endpoints and HTTP methods
- **Controllers:** Handle request processing and response formatting
- **Models:** Mongoose schemas for data structure
- **Middleware:** Authentication verification (JWT)
- **Config:** Database connection setup

**Technology Stack:**
- Express.js 4.21 for REST API
- Mongoose 8.8 for MongoDB ODM
- jsonwebtoken for JWT creation/verification
- bcryptjs for password hashing
- CORS for cross-origin requests
- dotenv for environment variables

### 3. Database Layer (MongoDB)
**Purpose:** Persistent data storage

**Collections:**
- **users:** User accounts with hashed passwords
- **incomes:** Income transactions linked to users
- **expenses:** Expense transactions linked to users

## Architecture Patterns

### Client-Side Architecture

**Component Hierarchy:**
```
App (BrowserRouter)
└── AuthProvider (Context)
    └── AppRoutes
        ├── Public Routes
        │   ├── Login
        │   └── Register
        └── Protected Routes (ProtectedRoute wrapper)
            ├── MainLayout (Sidebar + Content)
            │   ├── Dashboard
            │   ├── Income
            │   └── Expenses
```

**State Management:**
- **Global State:** AuthContext (user, authentication status, login/logout methods)
- **Local State:** Component-level useState for forms, modals, loading states
- **Persistent State:** localStorage for JWT token

**Data Flow:**
```
Component → Service → API (axios) → Backend
                ↓
         Update Local State
                ↓
         Re-render UI
```

### Server-Side Architecture

**Request Lifecycle:**
```
HTTP Request
    ↓
Express Router (route matching)
    ↓
Middleware (authenticate - JWT verification)
    ↓
Controller (business logic)
    ↓
Model (Mongoose query)
    ↓
MongoDB (data operation)
    ↓
Response (JSON)
```

**Layered Structure:**
- **Routes Layer:** URL mapping and HTTP method definition
- **Middleware Layer:** Cross-cutting concerns (auth, CORS, JSON parsing)
- **Controller Layer:** Request handling and business logic
- **Model Layer:** Data schema and validation
- **Database Layer:** MongoDB operations via Mongoose

## Authentication Flow

```
User Registration:
Client → POST /users/register → Hash password (bcrypt) → Save to DB → Success

User Login:
Client → POST /users/login → Verify password → Generate JWT → Return token

Authenticated Requests:
Client → Add "Authorization: Bearer <token>" header → Middleware verifies JWT → Extract userId → Controller uses userId → Response
```

**JWT Payload:**
```json
{
  "id": "user_mongodb_id",
  "username": "user_username",
  "iat": 1234567890,
  "exp": 1234571490
}
```

**Token Storage:** localStorage on client-side

## Data Relationships

```
User (1) ──────< Income (many)
         │
         └─────< Expense (many)
```

Each Income and Expense document has a `user` field (ObjectId reference) linking it to a User.

## Security Considerations

**Implemented:**
- Password hashing with bcrypt (10 salt rounds)
- JWT-based stateless authentication
- Token expiration (1 hour)
- Protected API routes with authentication middleware
- CORS configuration for specific origin

**Potential Improvements:**
- JWT secret is hardcoded (should use environment variable)
- No refresh token mechanism
- No rate limiting
- No input validation/sanitization library (express-validator)
- No HTTPS enforcement

## Deployment Architecture (Assumed)

**Development:**
- Frontend: localhost:3000 (react-scripts dev server)
- Backend: localhost:5000 (Node.js)
- Database: Local MongoDB or MongoDB Atlas

**Production (Typical):**
- Frontend: Static hosting (Vercel, Netlify, S3)
- Backend: Node.js hosting (Heroku, Railway, AWS EC2)
- Database: MongoDB Atlas (cloud)

## Key Design Decisions

1. **Monorepo Structure:** Client and server in separate folders but same repository
2. **JWT over Sessions:** Stateless authentication for scalability
3. **Context API over Redux:** Simpler state management for small app
4. **Styled Components:** Component-scoped styling, dynamic theming
5. **Axios Interceptors:** Centralized token injection and error handling
6. **Protected Routes:** Client-side route guards for authenticated pages
7. **Service Layer:** Abstraction between components and API calls

## Scalability Considerations

**Current Limitations:**
- No pagination for transactions (loads all data)
- No caching mechanism
- Dashboard aggregations run on every request
- No database indexing strategy visible

**Potential Enhancements:**
- Add pagination/infinite scroll
- Implement Redis caching for dashboard data
- Add database indexes on user field and date field
- Consider GraphQL for flexible data fetching
- Add WebSocket for real-time updates
