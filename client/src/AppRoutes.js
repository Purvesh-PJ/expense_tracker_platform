import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Imported Layouts
import HomeLayout from './layout/HomeLayout';
// Imported Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ExpenseManagement from './pages/ExpenseManagement';
import IncomeManagement from './pages/IncomeManagement';
import NotFound from './pages/NotFound';
import Reports from './pages/Reports';
import DataVisualization from './pages/DataVisualization';

const AppRoutes = () => {

  return (

    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/ExpenseManagement" element={<ExpenseManagement />} />
        <Route path="/IncomeManagement" element={<IncomeManagement />} />
        <Route path="/DataVisualization" element={<DataVisualization />} />
        <Route path="/Reports" element={<Reports />} />
      </Route>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
