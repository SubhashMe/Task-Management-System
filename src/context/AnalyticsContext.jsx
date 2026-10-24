import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initialOrders } from '../data/orders';
import { initialProducts } from '../data/products';
import { initialCustomers } from '../data/customers';
import { initialCategories } from '../data/categories';
import { initialRegions } from '../data/regions';
import { initialCampaigns } from '../data/campaigns';
import {
  calculateOrderMetrics,
  calculateCustomerMetrics,
  calculateMarketingMetrics,
  calculateDelta
} from '../utils/calculations';
import { isOrderInDateRange } from '../utils/dateUtils';
import { exportToCSV } from '../utils/csvExport';

const AnalyticsContext = createContext(null);

const STORAGE_KEYS = {
  ORDERS: 'insightiq_orders_v1',
  PRODUCTS: 'insightiq_products_v1',
  CUSTOMERS: 'insightiq_customers_v1',
  THEME: 'insightiq_theme_v1',
  DENSITY: 'insightiq_density_v1',
  CURRENCY: 'insightiq_currency_v1',
  AUTH: 'insightiq_auth_session_v1'
};

export const AnalyticsProvider = ({ children }) => {
  // Authentication State (user=Admin, password=Admin@123)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  const [currentUser] = useState({
    username: 'Admin',
    name: 'Jane Doe',
    role: 'Chief Analytics Officer',
    email: 'admin@insightiq.io',
    avatar: 'JD'
  });

  const login = (username, password) => {
    if (username.trim() === 'Admin' && password === 'Admin@123') {
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      showToast('Welcome, Admin! Analytics session authenticated.', 'success');
      return { success: true };
    }
    return {
      success: false,
      message: 'Invalid username or password. Please verify your credentials.'
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    showToast('You have been logged out.', 'info');
  };

  // Dedicated Luxury Dark Aurora Theme
  const theme = 'dark';
  const [tableDensity, setTableDensity] = useState(() => localStorage.getItem(STORAGE_KEYS.DENSITY) || 'standard');
  const [currency, setCurrency] = useState('USD');

  // Core Data Collections
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [categories, setCategories] = useState(initialCategories);
  const [regions, setRegions] = useState(initialRegions);
  const [campaigns, setCampaigns] = useState(initialCampaigns);

  // Global Filters State
  const [dateRange, setDateRange] = useState('12M'); // '7D' | '30D' | '90D' | 'YTD' | '12M' | 'ALL' | 'CUSTOM'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // UI States
  const [toasts, setToasts] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Persist Data to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  // Apply Dedicated Dark Theme Attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
  }, []);

  // Toast System
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {};

  // --------------------------------------------------------------------------
  // Core Multi-Dimensional Filtering Logic
  // --------------------------------------------------------------------------
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Date filter
      const matchDate = isOrderInDateRange(ord.orderDate, dateRange, customStartDate, customEndDate);
      // Region filter
      const matchRegion = selectedRegion === 'All' || ord.region === selectedRegion;
      // Category filter
      const matchCategory = selectedCategory === 'All' || ord.category === selectedCategory;
      // Channel filter
      const matchChannel = selectedChannel === 'All' || ord.salesChannel === selectedChannel;
      // Segment filter
      const matchSegment = selectedSegment === 'All' || ord.customerSegment === selectedSegment;
      // Status filter
      const matchStatus = selectedStatus === 'All' || ord.status === selectedStatus;
      // Search term
      const matchSearch = !globalSearchTerm.trim() ||
        ord.id.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
        ord.productName.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
        ord.customerName.toLowerCase().includes(globalSearchTerm.toLowerCase());

      return matchDate && matchRegion && matchCategory && matchChannel && matchSegment && matchStatus && matchSearch;
    });
  }, [
    orders,
    dateRange,
    customStartDate,
    customEndDate,
    selectedRegion,
    selectedCategory,
    selectedChannel,
    selectedSegment,
    selectedStatus,
    globalSearchTerm
  ]);

  // Active filters count for chip badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (dateRange !== '12M') count++;
    if (selectedRegion !== 'All') count++;
    if (selectedCategory !== 'All') count++;
    if (selectedChannel !== 'All') count++;
    if (selectedSegment !== 'All') count++;
    if (selectedStatus !== 'All') count++;
    return count;
  }, [dateRange, selectedRegion, selectedCategory, selectedChannel, selectedSegment, selectedStatus]);

  const resetAllFilters = () => {
    setDateRange('12M');
    setCustomStartDate('');
    setCustomEndDate('');
    setSelectedRegion('All');
    setSelectedCategory('All');
    setSelectedChannel('All');
    setSelectedSegment('All');
    setSelectedStatus('All');
    setGlobalSearchTerm('');
    showToast('All global filters have been reset to default', 'info');
  };

  // --------------------------------------------------------------------------
  // Dynamic Metrics & Comparisons (Reconciled from filtered orders)
  // --------------------------------------------------------------------------
  const currentMetrics = useMemo(() => {
    return calculateOrderMetrics(filteredOrders);
  }, [filteredOrders]);

  // Simulated previous period baseline (approx 89% of current for realistic trend metrics)
  const previousMetrics = useMemo(() => {
    return {
      netSales: Math.round(currentMetrics.netSales * 0.88),
      netProfit: Math.round(currentMetrics.netProfit * 0.86),
      grossProfit: Math.round(currentMetrics.grossProfit * 0.87),
      totalOrders: Math.round(currentMetrics.totalOrders * 0.91),
      aov: Math.round(currentMetrics.aov * 0.97),
      conversionRate: 3.2
    };
  }, [currentMetrics]);

  // Deltas for KPI Cards
  const kpiDeltas = useMemo(() => {
    return {
      revenueDelta: calculateDelta(currentMetrics.netSales, previousMetrics.netSales),
      profitDelta: calculateDelta(currentMetrics.netProfit, previousMetrics.netProfit),
      marginDelta: calculateDelta(currentMetrics.netMargin, 20.8),
      ordersDelta: calculateDelta(currentMetrics.totalOrders, previousMetrics.totalOrders),
      aovDelta: calculateDelta(currentMetrics.aov, previousMetrics.aov),
      customersDelta: { percentChange: '+12.4%', trendType: 'positive' },
      growthDelta: { percentChange: '+14.2%', trendType: 'positive' },
      conversionDelta: calculateDelta(currentMetrics.conversionRate, previousMetrics.conversionRate)
    };
  }, [currentMetrics, previousMetrics]);

  const customerMetrics = useMemo(() => {
    return calculateCustomerMetrics(customers, filteredOrders);
  }, [customers, filteredOrders]);

  const marketingMetrics = useMemo(() => {
    return calculateMarketingMetrics(campaigns);
  }, [campaigns]);

  // --------------------------------------------------------------------------
  // Product CRUD
  // --------------------------------------------------------------------------
  const addProduct = (newProduct) => {
    const id = `PRD-${String(products.length + 1).padStart(2, '0')}`;
    const price = Number(newProduct.unitPrice) || 1000;
    const cost = Number(newProduct.unitCost) || 300;
    const margin = price > 0 ? ((price - cost) / price) * 100 : 0;

    const prod = {
      ...newProduct,
      id,
      unitPrice: price,
      unitCost: cost,
      marginPercent: Number(margin.toFixed(1)),
      inventory: Number(newProduct.inventory) || 100,
      status: newProduct.status || 'Active'
    };

    setProducts((prev) => [prod, ...prev]);
    showToast(`Added product "${prod.name}" successfully`, 'success');
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const price = updatedFields.unitPrice !== undefined ? Number(updatedFields.unitPrice) : p.unitPrice;
          const cost = updatedFields.unitCost !== undefined ? Number(updatedFields.unitCost) : p.unitCost;
          const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
          return {
            ...p,
            ...updatedFields,
            unitPrice: price,
            unitCost: cost,
            marginPercent: Number(margin.toFixed(1))
          };
        }
        return p;
      })
    );
    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted from catalog', 'info');
  };

  // Factory Reset Sandbox
  const resetToDefaults = () => {
    setOrders(initialOrders);
    setProducts(initialProducts);
    setCustomers(initialCustomers);
    setCampaigns(initialCampaigns);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    resetAllFilters();
    showToast('Sandbox reset to initial enterprise demo datasets', 'success');
  };

  return (
    <AnalyticsContext.Provider
      value={{
        // Themes & Appearance
        theme,
        toggleTheme,
        tableDensity,
        setTableDensity,
        currency,
        setCurrency,

        // Data Collections
        orders,
        products,
        customers,
        categories,
        regions,
        campaigns,

        // Filtered Results
        filteredOrders,
        activeFilterCount,

        // Computed Business Intelligence Metrics
        currentMetrics,
        previousMetrics,
        kpiDeltas,
        customerMetrics,
        marketingMetrics,

        // Global Filters State & Setters
        dateRange,
        setDateRange,
        customStartDate,
        setCustomStartDate,
        customEndDate,
        setCustomEndDate,
        selectedRegion,
        setSelectedRegion,
        selectedCategory,
        setSelectedCategory,
        selectedChannel,
        setSelectedChannel,
        selectedSegment,
        setSelectedSegment,
        selectedStatus,
        setSelectedStatus,
        globalSearchTerm,
        setGlobalSearchTerm,
        resetAllFilters,

        // Actions
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefaults,
        exportToCSV,

        // UI & Modals
        toasts,
        showToast,
        removeToast,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileSidebarOpen,
        setMobileSidebarOpen,

        // Authentication State & Handlers
        isAuthenticated,
        currentUser,
        login,
        logout
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
