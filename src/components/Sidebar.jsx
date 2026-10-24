import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Megaphone,
  Globe,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Building2,
  X,
  Layers,
  LogOut
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

const NAV_ITEMS = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Sales Analytics', path: '/sales', icon: TrendingUp },
  { name: 'Revenue & Profit', path: '/revenue', icon: DollarSign },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Marketing Analytics', path: '/marketing', icon: Megaphone },
  { name: 'Regional Performance', path: '/regional', icon: Globe },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings }
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    currentUser,
    logout
  } = useAnalytics();

  const closeMobile = () => setMobileSidebarOpen(false);

  // Automatically close mobile sidebar whenever the active route/location changes
  useEffect(() => {
    closeMobile();
  }, [location.pathname]);

  const handleLogout = () => {
    closeMobile();
    logout();
    navigate('/login');
  };

  const renderSidebarContent = (isMobile = false) => {
    // In mobile view, NEVER collapse — ALWAYS show full names, titles, and details!
    const collapsed = isMobile ? false : sidebarCollapsed;

    return (
      <div
        className="d-flex flex-column h-100"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          userSelect: 'none'
        }}
      >
        {/* Brand Header */}
        <div
          className="d-flex align-items-center justify-content-between p-3 flex-shrink-0"
          style={{ height: '64px', borderBottom: '1px solid var(--border-color)' }}
        >
          <Link
            to="/"
            onClick={closeMobile}
            className="d-flex align-items-center overflow-hidden flex-grow-1 text-decoration-none"
            style={{ gap: '16px' }}
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(255, 90, 95, 0.4)',
                borderRadius: '12px'
              }}
            >
              <BarChart3 size={20} />
            </div>

            {!collapsed && (
              <div className="overflow-hidden flex-grow-1 ps-2" style={{ minWidth: 0, marginLeft: '8px' }}>
                <div
                  className="fw-bold text-nowrap"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    letterSpacing: '-0.02em',
                    color: '#ffffff',
                    lineHeight: 1.25,
                    marginBottom: '2px'
                  }}
                >
                  Insight<span style={{ color: 'var(--primary)', marginLeft: '1.5px' }}>IQ</span>
                </div>
                <div
                  className="text-secondary text-nowrap"
                  style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.05em' }}
                >
                  ENTERPRISE ANALYTICS
                </div>
              </div>
            )}
          </Link>

          {/* Mobile close button (X) */}
          {isMobile && (
            <button
              type="button"
              onClick={closeMobile}
              className="btn btn-sm d-flex align-items-center justify-content-center flex-shrink-0 text-white"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)'
              }}
              aria-label="Close navigation menu"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Workspace Selector */}
        {!collapsed && (
          <div className="p-3 border-bottom flex-shrink-0" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div
              className="p-2.5 rounded-3 d-flex align-items-center justify-content-between"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div className="d-flex align-items-center overflow-hidden flex-grow-1" style={{ gap: '14px' }}>
                <div
                  className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: 'rgba(255, 90, 95, 0.12)',
                    color: 'var(--primary)',
                    borderRadius: '8px'
                  }}
                >
                  <Building2 size={16} />
                </div>
                <div className="overflow-hidden flex-grow-1 ps-1" style={{ minWidth: 0 }}>
                  <div className="fw-semibold text-truncate text-white" style={{ fontSize: '0.82rem' }}>
                    Acme Global HQ
                  </div>
                  <div className="text-muted text-truncate" style={{ fontSize: '0.68rem' }}>
                    Production Analytics
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation List — Full Names Always Displayed */}
        <div className="flex-grow-1 p-2 overflow-y-auto">
          <nav className="nav flex-column gap-1.5" role="navigation" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => {
                    if (isMobile) {
                      closeMobile();
                    }
                  }}
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center px-3 py-2 rounded-3 transition-all position-relative ${
                      isActive ? 'active' : ''
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent',
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid transparent',
                    boxShadow: isActive ? '0 4px 14px rgba(0, 0, 0, 0.25)' : 'none',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.86rem',
                    textDecoration: 'none',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '8px 0' : '9px 12px'
                  })}
                  title={collapsed ? item.name : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                        style={{
                          width: '28px',
                          height: '28px',
                          backgroundColor: isActive ? 'rgba(255, 90, 95, 0.15)' : 'var(--bg-subtle)',
                          color: isActive ? 'var(--primary)' : 'var(--text-secondary)'
                        }}
                      >
                        <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                      </div>
                      {!collapsed && (
                        <span
                          className="flex-grow-1 text-nowrap ms-2.5"
                          style={{
                            fontSize: '0.86rem',
                            color: isActive ? '#ffffff' : 'var(--text-secondary)',
                            display: 'inline-block',
                            paddingLeft: '6px'
                          }}
                        >
                          {item.name}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer with Full Name & Role */}
        <div
          className="p-3 border-top mt-auto flex-shrink-0"
          style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}
        >
          <div
            className="d-flex align-items-center gap-2.5"
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-white font-bold"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--primary)',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              {currentUser?.avatar || 'JD'}
            </div>

            {!collapsed && (
              <div className="overflow-hidden flex-grow-1" style={{ minWidth: 0 }}>
                <div
                  className="fw-semibold text-white text-truncate"
                  style={{ fontSize: '0.84rem', lineHeight: 1.2 }}
                >
                  {currentUser?.name || 'Jane Doe'}
                </div>
                <div
                  className="text-muted text-truncate"
                  style={{ fontSize: '0.72rem', marginTop: '2px' }}
                >
                  {currentUser?.role || 'Chief Analytics Officer'}
                </div>
              </div>
            )}

            {!collapsed && (
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-sm p-1.5 text-danger rounded-2 flex-shrink-0"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.25)'
                }}
                title="Log Out (Exit Session)"
                aria-label="Log Out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Collapse Toggle */}
        <div
          className="p-2 border-top d-none d-lg-flex justify-content-center flex-shrink-0"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="btn btn-sm w-100 d-flex align-items-center justify-content-center text-secondary py-1"
            style={{
              fontSize: '0.75rem',
              gap: '6px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)'
            }}
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <ChevronLeft size={16} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. Desktop Persistent Sidebar (>= 992px) */}
      <aside
        className="d-none d-lg-block position-fixed top-0 start-0 bottom-0 transition-all"
        style={{
          width: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          height: '100vh',
          zIndex: 1020
        }}
        aria-label="Desktop Sidebar Navigation"
      >
        {renderSidebarContent(false)}
      </aside>

      {/* 2. Mobile Offcanvas Backdrop (< 992px) */}
      {mobileSidebarOpen && (
        <div
          className="d-lg-none position-fixed inset-0"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 12, 18, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 1040
          }}
          onClick={closeMobile}
        />
      )}

      {/* 3. Mobile Offcanvas Drawer (< 992px) — ALWAYS full names shown, auto-closes on selection */}
      <aside
        className="d-lg-none position-fixed top-0 start-0 bottom-0"
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: '290px',
          height: '100vh',
          zIndex: 1050,
          transform: mobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          borderRight: '1px solid var(--border-color)',
          boxShadow: mobileSidebarOpen ? '0 0 30px rgba(0, 0, 0, 0.65)' : 'none',
          visibility: mobileSidebarOpen ? 'visible' : 'hidden',
          pointerEvents: mobileSidebarOpen ? 'auto' : 'none'
        }}
        aria-label="Mobile Navigation Drawer"
      >
        {renderSidebarContent(true)}
      </aside>

      {/* 4. Luxury Floating Pill Capsule Bottom Navigation Bar (< 992px) */}
      <div className="mobile-bottom-bar-wrapper d-lg-none">
        <nav
          className="mobile-bottom-bar"
          role="navigation"
          aria-label="Mobile Quick Navigation"
        >
          <NavLink
            to="/"
            end
            onClick={closeMobile}
            className={({ isActive }) => `mobile-bottom-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/sales"
            onClick={closeMobile}
            className={({ isActive }) => `mobile-bottom-item ${isActive ? 'active' : ''}`}
          >
            <TrendingUp size={18} />
            <span>Sales</span>
          </NavLink>

          {/* Highlight Center Floating Mint Pill Action Button from user screenshot! */}
          <NavLink
            to="/revenue"
            onClick={closeMobile}
            className="mobile-bottom-item-center text-decoration-none"
            aria-label="Revenue & Finance"
            title="Revenue Overview"
          >
            <DollarSign size={22} strokeWidth={2.4} />
          </NavLink>

          <NavLink
            to="/customers"
            onClick={closeMobile}
            className={({ isActive }) => `mobile-bottom-item ${isActive ? 'active' : ''}`}
          >
            <Users size={18} />
            <span>Clients</span>
          </NavLink>

          {/* Menu button to open full 9-module drawer */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className={`mobile-bottom-item ${mobileSidebarOpen ? 'active' : ''}`}
            aria-label="Open full platform modules menu"
          >
            <Layers size={18} />
            <span>Menu</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
