import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { GlobalFilters } from '../components/GlobalFilters';
import { ToastContainer } from '../components/Toast';
import { useAnalytics } from '../context/AnalyticsContext';

export const DashboardLayout = () => {
  const { sidebarCollapsed } = useAnalytics();
  const location = useLocation();

  // Multi-dimensional filters are shown on core analytical exploration pages
  const isFilterableRoute = ['/', '/sales', '/revenue', '/customers', '/products', '/regional'].includes(location.pathname);

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Sidebar (Desktop Persistent & Mobile Drawer) */}
      <Sidebar />

      {/* Main Content Area with Desktop Sidebar Offset */}
      <div
        className={`main-layout-container transition-all d-flex flex-column flex-grow-1 ${
          sidebarCollapsed ? 'sidebar-is-collapsed' : ''
        }`}
        style={{
          minWidth: 0
        }}
      >
        <Header />

        <main className="main-content-body flex-grow-1">
          {isFilterableRoute && <GlobalFilters />}
          <Outlet />
        </main>
      </div>

      {/* Global Notification Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
