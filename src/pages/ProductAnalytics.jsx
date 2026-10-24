import React, { useState, useMemo } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { KPICard } from '../components/KPICard';
import { ChartCard } from '../components/ChartCard';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { formatCurrency, formatNumber, formatPercent } from '../utils/currencyFormatter';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  AlertTriangle,
  Award,
  CheckCircle,
  Eye
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const ProductAnalytics = () => {
  const {
    products,
    categories,
    filteredOrders,
    addProduct,
    updateProduct,
    deleteProduct
  } = useAnalytics();

  // Aggregate product volume, revenue, profit from orders
  const productStats = useMemo(() => {
    const statsMap = {};
    products.forEach((p) => {
      statsMap[p.id] = {
        ...p,
        unitsSold: 0,
        revenue: 0,
        cost: 0,
        profit: 0
      };
    });

    filteredOrders.forEach((o) => {
      if (statsMap[o.productId]) {
        statsMap[o.productId].unitsSold += o.quantity;
        statsMap[o.productId].revenue += o.netSales;
        statsMap[o.productId].cost += o.costOfGoodsSold;
        statsMap[o.productId].profit += o.netProfit;
      }
    });

    return Object.values(statsMap).map((item) => {
      const calcMargin =
        item.revenue > 0
          ? Number(((item.profit / item.revenue) * 100).toFixed(1))
          : item.marginPercent;

      let perfStatus = 'Active';
      if (item.unitsSold > 40) perfStatus = 'High';
      else if (item.unitsSold < 10) perfStatus = 'At Risk';
      else perfStatus = 'On Track';

      return {
        ...item,
        marginPercent: calcMargin,
        perfStatus
      };
    });
  }, [products, filteredOrders]);

  // Product KPIs
  const bestSeller = useMemo(() => {
    return [...productStats].sort((a, b) => b.unitsSold - a.unitsSold)[0] || {};
  }, [productStats]);

  const topRevenueProduct = useMemo(() => {
    return [...productStats].sort((a, b) => b.revenue - a.revenue)[0] || {};
  }, [productStats]);

  const mostProfitableProduct = useMemo(() => {
    return [...productStats].sort((a, b) => b.profit - a.profit)[0] || {};
  }, [productStats]);

  const atRiskCount = useMemo(() => {
    return productStats.filter((p) => p.perfStatus === 'At Risk').length;
  }, [productStats]);

  // State for Add / Edit / Delete modals
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | 'view'
  const [activeProduct, setActiveProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Enterprise Software',
    unitPrice: 1500,
    unitCost: 400,
    inventory: 150,
    status: 'Active'
  });

  const openAddModal = () => {
    setFormData({
      name: '',
      category: categories[0]?.name || 'Enterprise Software',
      unitPrice: 1500,
      unitCost: 400,
      inventory: 150,
      status: 'Active'
    });
    setModalMode('add');
  };

  const openEditModal = (prod) => {
    setActiveProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      unitPrice: prod.unitPrice,
      unitCost: prod.unitCost,
      inventory: prod.inventory || 100,
      status: prod.status || 'Active'
    });
    setModalMode('edit');
  };

  const openViewModal = (prod) => {
    setActiveProduct(prod);
    setModalMode('view');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (modalMode === 'add') {
      addProduct(formData);
    } else if (modalMode === 'edit' && activeProduct) {
      updateProduct(activeProduct.id, formData);
    }
    setModalMode(null);
  };

  // Top 6 Products by Revenue chart data
  const topProductsChart = useMemo(() => {
    return [...productStats]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6)
      .map((p) => ({
        name: p.name.length > 18 ? p.name.slice(0, 16) + '...' : p.name,
        revenue: p.revenue,
        profit: p.profit
      }));
  }, [productStats]);

  // Table Columns
  const columns = [
    {
      key: 'id',
      title: 'Product ID',
      sortable: true,
      render: (val, row) => (
        <button
          type="button"
          onClick={() => openViewModal(row)}
          className="btn btn-link p-0 font-mono fw-bold text-decoration-none"
          style={{ color: 'var(--brand-primary)', fontSize: '0.8rem' }}
        >
          {val}
        </button>
      )
    },
    {
      key: 'name',
      title: 'Product Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
            {val}
          </div>
          <div className="text-muted" style={{ fontSize: '0.725rem' }}>
            {row.category}
          </div>
        </div>
      )
    },
    {
      key: 'unitPrice',
      title: 'Unit Price',
      align: 'right',
      sortable: true,
      render: (val) => <span className="font-mono">{formatCurrency(val)}</span>
    },
    {
      key: 'unitsSold',
      title: 'Units Sold',
      align: 'center',
      sortable: true,
      render: (val) => <span className="fw-medium font-mono">{val}</span>
    },
    {
      key: 'revenue',
      title: 'Revenue',
      align: 'right',
      sortable: true,
      render: (val) => (
        <span className="font-mono fw-bold" style={{ color: 'var(--text-primary)' }}>
          {formatCurrency(val)}
        </span>
      )
    },
    {
      key: 'profit',
      title: 'Profit',
      align: 'right',
      sortable: true,
      render: (val) => (
        <span className="font-mono text-success fw-semibold">
          {formatCurrency(val)}
        </span>
      )
    },
    {
      key: 'marginPercent',
      title: 'Margin',
      align: 'right',
      sortable: true,
      render: (val) => (
        <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
          {formatPercent(val)}
        </span>
      )
    },
    {
      key: 'perfStatus',
      title: 'Performance',
      align: 'center',
      sortable: true,
      render: (val) => <StatusBadge status={val} size="sm" />
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <div className="d-flex align-items-center justify-content-center gap-1">
          <button
            type="button"
            onClick={() => openViewModal(row)}
            className="btn btn-sm btn-ghost p-1 text-muted"
            title="Inspect"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="btn btn-sm btn-ghost p-1 text-muted"
            title="Edit"
          >
            <Edit size={14} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteConfirmId(row.id)}
            className="btn btn-sm btn-ghost p-1 text-danger"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* 5 Product KPIs */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-2-4" style={{ flex: '1 0 18%' }}>
          <KPICard
            title="Catalog Size"
            value={formatNumber(products.length)}
            delta={{ percentChange: '+2 newly added', trendType: 'positive' }}
            comparisonLabel="active SKUs"
            tooltip="Total number of active commercial software & service offerings."
            icon={Package}
            sparklineData={[18, 18, 19, 19, 20, 20, 20, 20]}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-2-4" style={{ flex: '1 0 18%' }}>
          <KPICard
            title="Best-Seller Volume"
            value={`${bestSeller.unitsSold || 0} units`}
            delta={{ percentChange: bestSeller.name || 'N/A', trendType: 'positive' }}
            comparisonLabel="highest sales volume"
            tooltip="Product with the highest count of completed line unit deliveries."
            icon={Award}
            sparklineData={[25, 30, 32, 40, 42, 48, 52, 58]}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-2-4" style={{ flex: '1 0 18%' }}>
          <KPICard
            title="Top Revenue SKU"
            value={formatCurrency(topRevenueProduct.revenue || 0)}
            delta={{ percentChange: topRevenueProduct.name || 'N/A', trendType: 'positive' }}
            comparisonLabel="highest monetary yield"
            tooltip="Product generating the largest gross & net dollar volume."
            icon={DollarSign}
            sparklineData={[60, 70, 85, 90, 110, 125, 140, 160]}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-2-4" style={{ flex: '1 0 18%' }}>
          <KPICard
            title="Top Net Profit SKU"
            value={formatCurrency(mostProfitableProduct.profit || 0)}
            delta={{ percentChange: `${mostProfitableProduct.marginPercent || 0}% margin`, trendType: 'positive' }}
            comparisonLabel="highest bottom-line"
            tooltip="Product yielding the greatest net dollar profit."
            icon={TrendingUp}
            sparklineData={[30, 35, 42, 48, 55, 62, 70, 80]}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-2-4" style={{ flex: '1 0 18%' }}>
          <KPICard
            title="At-Risk Products"
            value={`${atRiskCount} SKUs`}
            delta={{ percentChange: 'low volume', trendType: atRiskCount > 0 ? 'negative' : 'positive' }}
            comparisonLabel="orders < 10 units"
            tooltip="Products displaying low sales velocity needing marketing interventions."
            icon={AlertTriangle}
            invertTrendColor={true}
            sparklineData={[3, 4, 3, 2, 3, 2, 3, 3]}
          />
        </div>
      </div>

      {/* Product Chart */}
      <ChartCard
        title="Revenue & Net Profit by Leading Product Solutions"
        subtitle="Monetary comparison across top-performing catalog items"
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={topProductsChart} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(val, name) => [formatCurrency(val), name === 'revenue' ? 'Revenue' : 'Net Profit']}
              contentStyle={{
                backgroundColor: '#181a26',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                fontSize: '0.8rem',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
              }}
            />
            <Bar dataKey="revenue" name="Revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" name="Net Profit" fill="var(--accent-mint)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Product Catalog DataTable with Add Product Action */}
      <DataTable
        title="Commercial Product Catalog"
        columns={columns}
        data={productStats}
        defaultSortKey="revenue"
        defaultSortDirection="desc"
        exportFilename="products-catalog.csv"
        searchPlaceholder="Filter product by name, category..."
        actionButton={
          <button
            type="button"
            onClick={openAddModal}
            className="btn btn-sm btn-primary d-flex align-items-center gap-1.5 text-white"
            style={{
              backgroundColor: 'var(--primary)',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              boxShadow: '0 4px 14px rgba(255, 90, 95, 0.35)'
            }}
          >
            <Plus size={15} />
            <span>Add Product</span>
          </button>
        }
      />

      {/* Add / Edit Modal */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <Modal
          isOpen={true}
          onClose={() => setModalMode(null)}
          title={modalMode === 'add' ? 'Add New Product Offering' : `Edit Product — ${activeProduct?.id}`}
          subtitle="Configure pricing, COGS costs, and classification"
          size="md"
        >
          <form onSubmit={handleSave} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                PRODUCT NAME
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-control"
                placeholder="e.g. Autonomous AI Workflow Server"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div className="row g-2">
              <div className="col-12 col-sm-6">
                <label className="form-label text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  CATEGORY
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-select"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  STATUS
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-select"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Discontinued">Discontinued</option>
                </select>
              </div>
            </div>

            <div className="row g-2">
              <div className="col-12 col-sm-6">
                <label className="form-label text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  UNIT PRICE ($)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  className="form-control"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  UNIT COST / COGS ($)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.unitCost}
                  onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                  className="form-control"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="btn btn-outline-secondary px-3 py-1.5"
                style={{ fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-3 py-1.5"
                style={{
                  backgroundColor: 'var(--brand-primary)',
                  borderColor: 'var(--brand-primary)',
                  fontSize: '0.85rem'
                }}
              >
                {modalMode === 'add' ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Product Details Modal */}
      {modalMode === 'view' && activeProduct && (
        <Modal
          isOpen={true}
          onClose={() => setModalMode(null)}
          title={`Product: ${activeProduct.name}`}
          subtitle={`SKU ID: ${activeProduct.id} • ${activeProduct.category}`}
          size="md"
          footer={
            <button
              type="button"
              onClick={() => setModalMode(null)}
              className="btn btn-primary px-3 py-1.5"
              style={{ backgroundColor: 'var(--brand-primary)', borderColor: 'var(--brand-primary)', fontSize: '0.85rem' }}
            >
              Done
            </button>
          }
        >
          <div className="d-flex flex-column gap-3">
            <div className="row g-2">
              <div className="col-6">
                <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>UNIT PRICE</span>
                  <div className="fw-bold font-mono" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                    {formatCurrency(activeProduct.unitPrice)}
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>UNIT COST</span>
                  <div className="fw-bold font-mono text-muted" style={{ fontSize: '1.25rem' }}>
                    {formatCurrency(activeProduct.unitCost)}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-2" style={{ borderColor: 'var(--border-subtle)', fontSize: '0.825rem' }}>
              <div className="row g-2">
                <div className="col-6">
                  <span className="text-muted">Total Units Sold:</span>
                  <div className="fw-bold font-mono">{activeProduct.unitsSold || 0}</div>
                </div>
                <div className="col-6">
                  <span className="text-muted">Net Revenue:</span>
                  <div className="fw-bold font-mono text-primary">{formatCurrency(activeProduct.revenue || 0)}</div>
                </div>
                <div className="col-6 mt-2">
                  <span className="text-muted">Net Profit:</span>
                  <div className="fw-bold font-mono text-success">{formatCurrency(activeProduct.profit || 0)}</div>
                </div>
                <div className="col-6 mt-2">
                  <span className="text-muted">Target Margin:</span>
                  <div className="fw-bold font-mono text-success">{formatPercent(activeProduct.marginPercent)}</div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteProduct(deleteConfirmId)}
        title="Delete Product SKU?"
        description="Are you sure you want to remove this product from the commercial catalog? All historic orders will remain intact."
        confirmText="Yes, Delete SKU"
        type="danger"
      />
    </div>
  );
};

export default ProductAnalytics;
