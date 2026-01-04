# Expense Tracker Platform

A full-stack expense and income tracking app with JWT authentication, charts, and dashboards. The project is split into a React client and an Express + MongoDB server.

## Features
- User registration and login with JWT
- Create, read, update, and delete income entries
- Create, read, update, and delete expense entries
- Dashboard views and charts for quick insights

## Tech Stack
- Frontend: React, React Router, Styled Components, Chart.js
- Backend: Node.js, Express, Mongoose, JWT, bcrypt
- Database: MongoDB
- Tooling: npm, nodemon

## Project Structure
- `client/` React application
- `server/` Express API and MongoDB models

## Prerequisites
- Node.js (LTS recommended) and npm
- MongoDB running locally on `mongodb://localhost:27017`

## Installation
1. Clone the repository and move into the project:
   ```bash
   git clone https://github.com/Purvesh-PJ/expense_tracker_platform.git
   cd expense_tracker_platform
   ```
2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

## Run Locally
1. Start MongoDB if it is not running.
2. Start the server:
   ```bash
   cd server
   npm run dev
   ```
   The server runs on `http://localhost:5000` by default.
3. Start the client in another terminal:
   ```bash
   cd client
   npm start
   ```
4. Open `http://localhost:3000` in your browser.

## Configuration
- Server port: set `PORT` to override the default `5000`.
- MongoDB URI: update `server/config/db.js` if you do not use the local default.
- Client API base URL for expenses: `client/src/services/ExpenseService.js`
- Client API base URL for income: `client/src/services/IncomeService.js`
- Client API base URL for dashboard: `client/src/services/DashboardService.js`
- CORS origin is set to `http://localhost:3000` in `server/server.js`.

## API Overview
All `/expenses` and `/income` routes require `Authorization: Bearer <token>`.

| Area     | Method | Endpoint                | Auth |
|----------|--------|-------------------------|------|
| Users    | POST   | `/users/register`       | No   |
| Users    | POST   | `/users/login`          | No   |
| Expenses | POST   | `/expenses/add`         | Yes  |
| Expenses | GET    | `/expenses/:userId`     | Yes  |
| Expenses | PUT    | `/expenses/edit/:id`    | Yes  |
| Expenses | DELETE | `/expenses/delete/:id`  | Yes  |
| Income   | POST   | `/income/add`           | Yes  |
| Income   | GET    | `/income/:userId`       | Yes  |
| Income   | PUT    | `/income/:id`           | Yes  |
| Income   | DELETE | `/income/:id`           | Yes  |

## Scripts
Server:
- `npm run dev` - start server with nodemon
- `npm start` - start server with node

Client:
- `npm start` - start React dev server
- `npm run build` - build for production
- `npm test` - run tests
