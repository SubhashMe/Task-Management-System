import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnalyticsProvider, useAnalytics } from './context/AnalyticsContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { SalesAnalytics } from './pages/SalesAnalytics';
import { RevenueProfit } from './pages/RevenueProfit';
import { CustomerAnalytics } from './pages/CustomerAnalytics';
import { ProductAnalytics } from './pages/ProductAnalytics';
import { MarketingAnalytics } from './pages/MarketingAnalytics';
import { RegionalAnalytics } from './pages/RegionalAnalytics';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAnalytics();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Auth Route Guard (Redirects to dashboard if already logged in)
const PublicAuthRoute = ({ children }) => {
  const { isAuthenticated } = useAnalytics();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export function App() {
  return (
    <AnalyticsProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route
            path="/login"
            element={
              <PublicAuthRoute>
                <Login />
              </PublicAuthRoute>
            }
          />

          {/* Protected Dashboard Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="sales" element={<SalesAnalytics />} />
            <Route path="revenue" element={<RevenueProfit />} />
            <Route path="customers" element={<CustomerAnalytics />} />
            <Route path="products" element={<ProductAnalytics />} />
            <Route path="marketing" element={<MarketingAnalytics />} />
            <Route path="regional" element={<RegionalAnalytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AnalyticsProvider>
  );
}

export default App;
