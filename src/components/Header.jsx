import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Download,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  LogOut,
  User,
  Settings as SettingsIcon,
  ChevronDown,
  ShieldCheck,
  BarChart3,
  X,
  Compass,
  ShoppingCart,
  Package,
  Users,
  CornerDownLeft,
  ArrowRight
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { formatCurrency } from '../utils/currencyFormatter';

const ROUTE_TITLES = {
  '/': { title: 'Executive Overview', section: 'Insights' },
  '/sales': { title: 'Sales Analytics', section: 'Commercial' },
  '/revenue': { title: 'Revenue & Profitability', section: 'Finance' },
  '/customers': { title: 'Customer Analytics', section: 'Audience' },
  '/products': { title: 'Product Analytics', section: 'Catalog' },
  '/marketing': { title: 'Marketing Analytics', section: 'Growth' },
  '/regional': { title: 'Regional Performance', section: 'Territories' },
  '/reports': { title: 'Reports & Export', section: 'Intelligence' },
  '/settings': { title: 'Platform Settings', section: 'System' }
};

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    globalSearchTerm,
    setGlobalSearchTerm,
    setMobileSidebarOpen,
    filteredOrders,
    orders,
    products,
    customers,
    currency,
    exportToCSV,
    showToast,
    currentUser,
    logout
  } = useAnalytics();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const currentRoute = ROUTE_TITLES[location.pathname] || { title: 'Analytics', section: 'Platform' };

  // Global keyboard shortcut: Ctrl+K / Cmd+K to focus search, ESC to dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchFocused(true);
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      } else if (e.key === 'Escape') {
        setSearchFocused(false);
        setMobileSearchActive(false);
        if (searchInputRef.current) searchInputRef.current.blur();
        if (mobileSearchInputRef.current) mobileSearchInputRef.current.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus mobile search input when activated
  useEffect(() => {
    if (mobileSearchActive && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [mobileSearchActive]);

  // Dynamic Live Search Results
  const searchResults = useMemo(() => {
    const term = (globalSearchTerm || '').trim().toLowerCase();
    if (!term) return { pages: [], orders: [], products: [], customers: [], totalCount: 0 };

    // 1. Pages
    const pages = Object.entries(ROUTE_TITLES)
      .filter(([path, info]) =>
        info.title.toLowerCase().includes(term) ||
        info.section.toLowerCase().includes(term) ||
        path.toLowerCase().includes(term)
      )
      .map(([path, info]) => ({ path, title: info.title, section: info.section }));

    // 2. Orders (limit to 3 matches)
    const matchedOrders = (orders || [])
      .filter(ord =>
        ord.id.toLowerCase().includes(term) ||
        ord.customerName.toLowerCase().includes(term) ||
        ord.productName.toLowerCase().includes(term) ||
        (ord.status && ord.status.toLowerCase().includes(term))
      )
      .slice(0, 3);

    // 3. Products (limit to 3 matches)
    const matchedProducts = (products || [])
      .filter(prod =>
        prod.name.toLowerCase().includes(term) ||
        prod.category.toLowerCase().includes(term) ||
        prod.id.toLowerCase().includes(term)
      )
      .slice(0, 3);

    // 4. Customers (limit to 3 matches)
    const matchedCustomers = (customers || [])
      .filter(cust =>
        cust.name.toLowerCase().includes(term) ||
        (cust.industry && cust.industry.toLowerCase().includes(term)) ||
        (cust.tier && cust.tier.toLowerCase().includes(term))
      )
      .slice(0, 3);

    const totalCount = pages.length + matchedOrders.length + matchedProducts.length + matchedCustomers.length;

    return {
      pages,
      orders: matchedOrders,
      products: matchedProducts,
      customers: matchedCustomers,
      totalCount
    };
  }, [globalSearchTerm, orders, products, customers]);

  const handleSelectResult = (type, target) => {
    setSearchFocused(false);
    setMobileSearchActive(false);

    if (type === 'page') {
      navigate(target);
    } else if (type === 'order') {
      navigate('/sales');
      showToast(`Viewing order details for #${target.id}`, 'info');
    } else if (type === 'product') {
      navigate('/products');
      showToast(`Viewing catalog product: ${target.name}`, 'info');
    } else if (type === 'customer') {
      navigate('/customers');
      showToast(`Viewing client profile: ${target.name}`, 'info');
    }
  };

  const handleClearSearch = () => {
    setGlobalSearchTerm('');
    if (searchInputRef.current) searchInputRef.current.focus();
    if (mobileSearchInputRef.current) mobileSearchInputRef.current.focus();
  };

  const handleExportData = () => {
    if (!filteredOrders || filteredOrders.length === 0) {
      showToast('No records available to export', 'warning');
      return;
    }
    exportToCSV(filteredOrders, `insightiq-orders-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/login');
  };

  const notifications = [
    {
      id: 1,
      title: 'Monthly Revenue Target Achieved',
      desc: 'APAC region exceeded sales forecast by 14.8%',
      time: '12m ago',
      type: 'success'
    },
    {
      id: 2,
      title: 'High Margin Trend Alert',
      desc: 'Enterprise Cloud Suite margin reached 78.4%',
      time: '1h ago',
      type: 'info'
    },
    {
      id: 3,
      title: 'Low Inventory Watch',
      desc: 'Edge AI Appliance inventory below 50 units',
      time: '3h ago',
      type: 'warning'
    }
  ];

  return (
    <header
      className="position-sticky top-0 z-3 px-3 px-md-4 d-flex align-items-center justify-content-between"
      style={{
        height: '66px',
        backgroundColor: 'rgba(21, 23, 34, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
        zIndex: 1010
      }}
    >
      {/* Mobile Search Active Overlay Header */}
      {mobileSearchActive ? (
        <div className="d-flex align-items-center w-100 animate-fade-in" style={{ gap: '10px' }}>
          <div className="position-relative flex-grow-1" ref={searchContainerRef}>
            <Search
              size={15}
              className="position-absolute"
              style={{
                top: '50%',
                left: '12px',
                transform: 'translateY(-50%)',
                color: 'var(--primary)'
              }}
            />
            <input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Search pages, orders, products, clients..."
              value={globalSearchTerm}
              onChange={(e) => setGlobalSearchTerm(e.target.value)}
              className="form-control form-control-sm ps-4 pe-4"
              style={{
                backgroundColor: '#171924',
                border: '1px solid var(--primary)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 500,
                borderRadius: 'var(--radius-full)',
                paddingLeft: '34px',
                paddingRight: '32px',
                height: '38px',
                boxShadow: '0 0 12px rgba(255, 90, 95, 0.25)'
              }}
            />
            {globalSearchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="btn btn-sm position-absolute p-0 border-0 text-muted"
                style={{
                  top: '50%',
                  right: '12px',
                  transform: 'translateY(-50%)',
                  background: 'transparent'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileSearchActive(false)}
            className="btn btn-sm text-secondary d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)'
            }}
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          {/* Left: Mobile Menu Toggle & Brand Logo + Name + Route Title */}
          <div className="d-flex align-items-center overflow-hidden me-2" style={{ gap: '14px' }}>
            {/* Mobile Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="btn btn-sm d-lg-none p-1.5 text-white d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                marginRight: '2px'
              }}
              aria-label="Open navigation menu"
            >
              <Menu size={18} strokeWidth={2.2} />
            </button>

            {/* Brand Logo & Brand Name with Generous Spacing (No crowding!) */}
            <Link
              to="/"
              className="d-flex align-items-center text-decoration-none flex-shrink-0"
              style={{ gap: '14px' }}
              title="InsightIQ Enterprise Analytics"
            >
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 2px 12px rgba(255, 90, 95, 0.4)'
                }}
              >
                <BarChart3 size={19} />
              </div>

              <div
                className="d-flex flex-column justify-content-center"
                style={{ marginLeft: '4px', marginRight: '6px' }}
              >
                <div
                  className="fw-bold text-nowrap"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.05rem',
                    letterSpacing: '-0.02em',
                    color: '#ffffff',
                    lineHeight: 1.15
                  }}
                >
                  Insight<span style={{ color: 'var(--primary)', marginLeft: '1.5px' }}>IQ</span>
                </div>
                <div
                  className="d-none d-sm-block text-secondary text-nowrap"
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    lineHeight: 1,
                    marginTop: '2px'
                  }}
                >
                  ENTERPRISE
                </div>
              </div>
            </Link>

            {/* Subtle Vertical Divider */}
            <div
              className="d-none d-md-block flex-shrink-0"
              style={{
                width: '1px',
                height: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                margin: '0 6px'
              }}
            />

            {/* Breadcrumb section badge & current page title */}
            <div className="d-flex align-items-center overflow-hidden" style={{ gap: '10px' }}>
              <div className="d-none d-md-flex align-items-center small fw-medium flex-shrink-0" style={{ gap: '8px' }}>
                <span
                  className="badge"
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    backgroundColor: 'rgba(255, 90, 95, 0.12)',
                    color: '#ff7e82',
                    border: '1px solid rgba(255, 90, 95, 0.25)',
                    borderRadius: 'var(--radius-full)',
                    padding: '4px 12px',
                    letterSpacing: '0.02em'
                  }}
                >
                  {currentRoute.section}
                </span>
                <ChevronRight size={14} className="text-muted" />
              </div>

              <h1
                className="h6 fw-bold mb-0 text-truncate"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  fontSize: '1.02rem',
                  fontWeight: 700,
                  lineHeight: 1.2
                }}
              >
                {currentRoute.title}
              </h1>
            </div>
          </div>

          {/* Right Action Stack: Search, Export, Notifications, User Menu */}
          <div className="d-flex align-items-center gap-2.5 flex-shrink-0 ms-auto ps-2">
            {/* Interactive Search Box Container with Results Dropdown */}
            <div
              className="position-relative d-none d-md-block"
              ref={searchContainerRef}
              style={{ width: searchFocused ? '280px' : '220px', transition: 'width 0.22s ease' }}
            >
              <Search
                size={14}
                className="position-absolute"
                style={{
                  top: '50%',
                  left: '12px',
                  transform: 'translateY(-50%)',
                  color: searchFocused ? 'var(--primary)' : 'var(--text-muted)'
                }}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search orders, metrics... (Ctrl+K)"
                value={globalSearchTerm}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setGlobalSearchTerm(e.target.value);
                  setSearchFocused(true);
                }}
                className="form-control form-control-sm ps-4 pe-4"
                style={{
                  backgroundColor: searchFocused ? '#1b1e2c' : '#171924',
                  border: searchFocused ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-full)',
                  paddingLeft: '32px',
                  paddingRight: globalSearchTerm ? '28px' : '12px',
                  boxShadow: searchFocused ? '0 0 14px rgba(255, 90, 95, 0.25)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              />

              {/* Clear button when input has text */}
              {globalSearchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="btn btn-sm position-absolute p-0 border-0 text-muted"
                  style={{
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    background: 'transparent'
                  }}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}

              {/* Live Interactive Search Results Popover */}
              {searchFocused && (
                <div
                  className="position-absolute mt-2 p-0 shadow-lg animate-scale-up"
                  style={{
                    top: '100%',
                    right: 0,
                    width: '380px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.65)',
                    borderRadius: 'var(--radius-lg)',
                    zIndex: 1060,
                    overflow: 'hidden'
                  }}
                >
                  {/* Popover Header */}
                  <div
                    className="p-3 border-bottom d-flex align-items-center justify-content-between"
                    style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Search size={14} className="text-coral" />
                      <span className="fw-bold" style={{ fontSize: '0.82rem', color: '#ffffff' }}>
                        {globalSearchTerm.trim()
                          ? `Results for "${globalSearchTerm}"`
                          : 'Quick Search & Modules'}
                      </span>
                    </div>

                    {globalSearchTerm.trim() ? (
                      <span
                        className="badge"
                        style={{
                          backgroundColor: searchResults.totalCount > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: searchResults.totalCount > 0 ? '#34d399' : '#f87171',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          borderRadius: 'var(--radius-full)'
                        }}
                      >
                        {searchResults.totalCount} matches
                      </span>
                    ) : (
                      <span className="small text-muted" style={{ fontSize: '0.68rem' }}>
                        Press ESC to close
                      </span>
                    )}
                  </div>

                  {/* Results List */}
                  <div className="p-2" style={{ maxHeight: '360px', overflowY: 'auto' }}>
                    {/* State A: User typed search query */}
                    {globalSearchTerm.trim() ? (
                      searchResults.totalCount === 0 ? (
                        <div className="py-4 text-center">
                          <div
                            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                            style={{
                              width: '42px',
                              height: '42px',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              color: 'var(--text-muted)'
                            }}
                          >
                            <AlertCircle size={20} />
                          </div>
                          <div className="fw-semibold text-white small">No matching results found</div>
                          <div className="text-muted small mt-1" style={{ fontSize: '0.74rem' }}>
                            Try searching for orders, products, clients, or analytics modules.
                          </div>
                          <button
                            type="button"
                            onClick={handleClearSearch}
                            className="btn btn-sm mt-3 px-3 py-1"
                            style={{
                              backgroundColor: 'var(--bg-subtle)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--primary)',
                              fontSize: '0.75rem',
                              borderRadius: 'var(--radius-full)'
                            }}
                          >
                            Clear Search Term
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* 1. Pages Matches */}
                          {searchResults.pages.length > 0 && (
                            <div className="mb-2.5">
                              <div className="text-muted px-2 py-1 small fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                                Navigation Pages
                              </div>
                              {searchResults.pages.map((p) => (
                                <div
                                  key={p.path}
                                  onClick={() => handleSelectResult('page', p.path)}
                                  className="d-flex align-items-center justify-content-between p-2 rounded-2 cursor-pointer mb-1"
                                  style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid transparent',
                                    transition: 'all 0.12s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = 'transparent';
                                  }}
                                >
                                  <div className="d-flex align-items-center gap-2.5">
                                    <div
                                      className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                                      style={{
                                        width: '26px',
                                        height: '26px',
                                        backgroundColor: 'rgba(255, 90, 95, 0.14)',
                                        color: 'var(--primary)'
                                      }}
                                    >
                                      <Compass size={14} />
                                    </div>
                                    <div>
                                      <div className="fw-semibold text-white" style={{ fontSize: '0.8rem' }}>
                                        {p.title}
                                      </div>
                                      <div className="text-muted" style={{ fontSize: '0.68rem' }}>
                                        Module: {p.section}
                                      </div>
                                    </div>
                                  </div>
                                  <ArrowRight size={13} className="text-muted" />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 2. Order Matches */}
                          {searchResults.orders.length > 0 && (
                            <div className="mb-2.5">
                              <div className="text-muted px-2 py-1 small fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                                Matching Orders
                              </div>
                              {searchResults.orders.map((ord) => (
                                <div
                                  key={ord.id}
                                  onClick={() => handleSelectResult('order', ord)}
                                  className="d-flex align-items-center justify-content-between p-2 rounded-2 cursor-pointer mb-1"
                                  style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid transparent',
                                    transition: 'all 0.12s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = 'transparent';
                                  }}
                                >
                                  <div className="d-flex align-items-center gap-2.5">
                                    <div
                                      className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                                      style={{
                                        width: '26px',
                                        height: '26px',
                                        backgroundColor: 'rgba(52, 211, 153, 0.14)',
                                        color: '#34d399'
                                      }}
                                    >
                                      <ShoppingCart size={14} />
                                    </div>
                                    <div>
                                      <div className="fw-semibold text-white" style={{ fontSize: '0.8rem' }}>
                                        #{ord.id} • {ord.customerName}
                                      </div>
                                      <div className="text-muted" style={{ fontSize: '0.68rem' }}>
                                        {ord.productName}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-end">
                                    <div className="fw-bold text-white" style={{ fontSize: '0.78rem' }}>
                                      {formatCurrency(ord.total, currency)}
                                    </div>
                                    <span
                                      className="badge p-0"
                                      style={{
                                        fontSize: '0.65rem',
                                        color: ord.status === 'Completed' ? '#34d399' : '#fbbf24'
                                      }}
                                    >
                                      {ord.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 3. Product Matches */}
                          {searchResults.products.length > 0 && (
                            <div className="mb-2.5">
                              <div className="text-muted px-2 py-1 small fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                                Catalog Products
                              </div>
                              {searchResults.products.map((prod) => (
                                <div
                                  key={prod.id}
                                  onClick={() => handleSelectResult('product', prod)}
                                  className="d-flex align-items-center justify-content-between p-2 rounded-2 cursor-pointer mb-1"
                                  style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid transparent',
                                    transition: 'all 0.12s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = 'transparent';
                                  }}
                                >
                                  <div className="d-flex align-items-center gap-2.5">
                                    <div
                                      className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                                      style={{
                                        width: '26px',
                                        height: '26px',
                                        backgroundColor: 'rgba(96, 165, 250, 0.14)',
                                        color: '#60a5fa'
                                      }}
                                    >
                                      <Package size={14} />
                                    </div>
                                    <div>
                                      <div className="fw-semibold text-white" style={{ fontSize: '0.8rem' }}>
                                        {prod.name}
                                      </div>
                                      <div className="text-muted" style={{ fontSize: '0.68rem' }}>
                                        {prod.category} • Margin {prod.marginPercent}%
                                      </div>
                                    </div>
                                  </div>
                                  <span className="fw-semibold text-white" style={{ fontSize: '0.78rem' }}>
                                    {formatCurrency(prod.unitPrice, currency)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 4. Customer Matches */}
                          {searchResults.customers.length > 0 && (
                            <div className="mb-1">
                              <div className="text-muted px-2 py-1 small fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                                Customer Accounts
                              </div>
                              {searchResults.customers.map((cust) => (
                                <div
                                  key={cust.id}
                                  onClick={() => handleSelectResult('customer', cust)}
                                  className="d-flex align-items-center justify-content-between p-2 rounded-2 cursor-pointer mb-1"
                                  style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid transparent',
                                    transition: 'all 0.12s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = 'transparent';
                                  }}
                                >
                                  <div className="d-flex align-items-center gap-2.5">
                                    <div
                                      className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                                      style={{
                                        width: '26px',
                                        height: '26px',
                                        backgroundColor: 'rgba(251, 191, 36, 0.14)',
                                        color: '#fbbf24'
                                      }}
                                    >
                                      <Users size={14} />
                                    </div>
                                    <div>
                                      <div className="fw-semibold text-white" style={{ fontSize: '0.8rem' }}>
                                        {cust.name}
                                      </div>
                                      <div className="text-muted" style={{ fontSize: '0.68rem' }}>
                                        {cust.industry} • {cust.region}
                                      </div>
                                    </div>
                                  </div>
                                  <span
                                    className="badge"
                                    style={{
                                      fontSize: '0.65rem',
                                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                      color: 'var(--text-secondary)'
                                    }}
                                  >
                                    {cust.tier}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )
                    ) : (
                      /* State B: Empty search field — Quick Discovery Links */
                      <div>
                        <div className="text-muted px-2 py-1 small fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                          Suggested Shortcuts
                        </div>

                        {[
                          { title: 'Executive Overview', path: '/', icon: Compass, desc: 'Real-time KPIs & charts' },
                          { title: 'Sales Analytics', path: '/sales', icon: ShoppingCart, desc: 'Transactions & channels' },
                          { title: 'Revenue & Profitability', path: '/revenue', icon: TrendingUp, desc: 'Financial margins & forecasts' },
                          { title: 'Customer Analytics', path: '/customers', icon: Users, desc: 'LTV, cohort & retention' },
                          { title: 'Reports & Export', path: '/reports', icon: Download, desc: 'Executive intelligence & CSV' }
                        ].map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <div
                              key={item.path}
                              onClick={() => handleSelectResult('page', item.path)}
                              className="d-flex align-items-center justify-content-between p-2 rounded-2 cursor-pointer mb-1"
                              style={{
                                backgroundColor: 'transparent',
                                border: '1px solid transparent',
                                transition: 'all 0.12s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.borderColor = 'transparent';
                              }}
                            >
                              <div className="d-flex align-items-center gap-2.5">
                                <div
                                  className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    backgroundColor: 'var(--bg-subtle)',
                                    color: 'var(--primary)'
                                  }}
                                >
                                  <ItemIcon size={14} />
                                </div>
                                <div>
                                  <div className="fw-semibold text-white" style={{ fontSize: '0.8rem' }}>
                                    {item.title}
                                  </div>
                                  <div className="text-muted" style={{ fontSize: '0.68rem' }}>
                                    {item.desc}
                                  </div>
                                </div>
                              </div>
                              <CornerDownLeft size={13} className="text-muted" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Popover Footer */}
                  <div
                    className="p-2.5 px-3 border-top d-flex align-items-center justify-content-between"
                    style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}
                  >
                    <span className="small text-muted" style={{ fontSize: '0.7rem' }}>
                      Click any item to jump directly to record
                    </span>
                    <span className="small text-coral fw-semibold" style={{ fontSize: '0.7rem' }}>
                      InsightIQ Smart Engine
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Search Button (< 768px) */}
            <button
              type="button"
              onClick={() => setMobileSearchActive(true)}
              className="btn btn-sm d-md-none p-1 d-flex align-items-center justify-content-center text-white"
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)'
              }}
              aria-label="Search"
            >
              <Search size={16} />
            </button>

            {/* Export Data Button */}
            <button
              type="button"
              onClick={handleExportData}
              className="btn btn-sm d-none d-sm-flex align-items-center gap-1.5"
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                color: '#ffffff',
                padding: '6px 14px'
              }}
              title="Export current view to CSV"
            >
              <Download size={14} strokeWidth={2} />
              <span>Export</span>
            </button>

            {/* Notifications Popover */}
            <div className="position-relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="btn btn-sm p-1 position-relative d-flex align-items-center justify-content-center"
                aria-label="View notifications"
                style={{
                  width: '38px',
                  height: '38px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '50%',
                  color: 'var(--text-secondary)'
                }}
              >
                <Bell size={16} strokeWidth={2} />
                <span
                  className="position-absolute rounded-circle"
                  style={{
                    top: '9px',
                    right: '9px',
                    width: '7px',
                    height: '7px',
                    backgroundColor: 'var(--primary)',
                    boxShadow: '0 0 6px var(--primary)'
                  }}
                />
              </button>

              {showNotifications && (
                <div
                  className="position-absolute end-0 mt-2 p-0 animate-scale-up"
                  style={{
                    width: '320px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: 'var(--shadow-lg)',
                    borderRadius: 'var(--radius-lg)',
                    zIndex: 1050,
                    overflow: 'hidden'
                  }}
                >
                  <div
                    className="p-3 border-bottom d-flex align-items-center justify-content-between"
                    style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}
                  >
                    <span className="fw-bold" style={{ fontSize: '0.85rem', color: '#ffffff' }}>
                      Notifications (3)
                    </span>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      Live Feed
                    </span>
                  </div>

                  <div className="p-2" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-3 mb-1 cursor-pointer"
                        style={{
                          backgroundColor: 'transparent',
                          border: '1px solid transparent',
                          transition: 'all 0.14s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fw-semibold" style={{ fontSize: '0.8rem', color: '#ffffff' }}>
                            {n.title}
                          </span>
                          <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                            {n.time}
                          </span>
                        </div>
                        <p className="text-secondary mb-0 mt-1" style={{ fontSize: '0.74rem', lineHeight: '1.3' }}>
                          {n.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div
                    className="p-2.5 text-center border-top"
                    style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}
                  >
                    <Link
                      to="/reports"
                      onClick={() => setShowNotifications(false)}
                      className="text-decoration-none fw-semibold"
                      style={{ fontSize: '0.78rem', color: 'var(--primary)' }}
                    >
                      View executive intelligence &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Account Menu with Logout */}
            <div className="position-relative ms-1" ref={userRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="btn btn-sm d-flex align-items-center gap-2 p-1 pe-3"
                aria-label="User account menu"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  color: '#ffffff'
                }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white font-bold flex-shrink-0"
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: 'var(--primary)',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  {currentUser?.avatar || 'JD'}
                </div>
                <span className="d-none d-lg-inline small fw-semibold text-white text-truncate" style={{ maxWidth: '100px' }}>
                  {currentUser?.username || 'Admin'}
                </span>
                <ChevronDown size={14} className="text-muted" />
              </button>

              {showUserMenu && (
                <div
                  className="position-absolute end-0 mt-2 p-0 animate-scale-up"
                  style={{
                    width: '240px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1050,
                    overflow: 'hidden'
                  }}
                >
                  <div className="p-3 border-bottom" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                    <div className="fw-bold" style={{ fontSize: '0.88rem', color: '#ffffff' }}>
                      {currentUser?.name || 'Jane Doe'}
                    </div>
                    <div className="text-secondary small" style={{ fontSize: '0.74rem' }}>
                      {currentUser?.email || 'admin@insightiq.io'}
                    </div>
                    <span
                      className="badge mt-2"
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      User: {currentUser?.username || 'Admin'} • Active
                    </span>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="dropdown-item d-flex align-items-center gap-2 p-2 rounded-2 small text-secondary"
                      style={{ fontSize: '0.8rem', textDecoration: 'none' }}
                    >
                      <SettingsIcon size={14} />
                      <span>Platform Settings</span>
                    </Link>

                    <div className="dropdown-divider my-1" style={{ borderColor: 'var(--border-color)' }} />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="dropdown-item d-flex align-items-center gap-2 p-2 rounded-2 small text-danger w-100 border-0 bg-transparent text-start cursor-pointer"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <LogOut size={14} />
                      <span>Log Out (Exit Session)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
