import React, { useState, useMemo } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { KPICard } from '../components/KPICard';
import { ChartCard } from '../components/ChartCard';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { formatCurrency, formatNumber, formatPercent } from '../utils/currencyFormatter';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Percent,
  RotateCcw,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Building,
  User,
  MapPin,
  Tag
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const SalesAnalytics = () => {
  const {
    filteredOrders,
    currentMetrics,
    kpiDeltas
  } = useAnalytics();

  const [selectedOrder, setSelectedOrder] = useState(null);

  // 1. Sales Trend over Time (Monthly Bar & Line)
  const monthlySalesTrend = useMemo(() => {
    const map = {};
    filteredOrders.forEach((o) => {
      const month = o.orderDate.slice(0, 7);
      if (!map[month]) {
        map[month] = { month, gross: 0, net: 0, refunds: 0, orders: 0 };
      }
      map[month].gross += o.grossAmount;
      map[month].net += o.netSales;
      map[month].refunds += o.refundAmount;
      map[month].orders += 1;
    });

    return Object.keys(map)
      .sort()
      .map((m) => map[m]);
  }, [filteredOrders]);

  // 2. Order Status Distribution
  const statusDistribution = useMemo(() => {
    const map = {};
    filteredOrders.forEach((o) => {
      map[o.status] = (map[o.status] || 0) + 1;
    });

    const colors = {
      Completed: '#10b981',
      Shipped: '#4f46e5',
      Processing: '#f59e0b',
      Refunded: '#ef4444'
    };

    return Object.keys(map).map((st) => ({
      name: st,
      count: map[st],
      color: colors[st] || '#64748b'
    }));
  }, [filteredOrders]);

  // 3. Channel breakdown
  const channelMetrics = useMemo(() => {
    const map = {};
    filteredOrders.forEach((o) => {
      if (!map[o.salesChannel]) {
        map[o.salesChannel] = { channel: o.salesChannel, revenue: 0, orders: 0 };
      }
      map[o.salesChannel].revenue += o.netSales;
      map[o.salesChannel].orders += 1;
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  // Table Columns
  const columns = [
    {
      key: 'id',
      title: 'Order ID',
      sortable: true,
      render: (val, row) => (
        <button
          type="button"
          onClick={() => setSelectedOrder(row)}
          className="btn btn-link p-0 font-mono fw-bold text-decoration-none"
          style={{ color: 'var(--brand-primary)', fontSize: '0.8rem' }}
        >
          {val}
        </button>
      )
    },
    {
      key: 'orderDate',
      title: 'Date',
      sortable: true,
      render: (val) => <span className="font-mono text-muted">{val}</span>
    },
    {
      key: 'productName',
      title: 'Product',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="fw-semibold text-truncate" style={{ maxWidth: '180px', color: 'var(--text-primary)' }}>
            {val}
          </div>
          <div className="text-muted text-truncate" style={{ fontSize: '0.72rem' }}>
            {row.category}
          </div>
        </div>
      )
    },
    {
      key: 'customerName',
      title: 'Customer',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="fw-medium text-truncate" style={{ maxWidth: '150px' }}>
            {val}
          </div>
          <div className="text-muted" style={{ fontSize: '0.72rem' }}>
            {row.customerSegment} • {row.region}
          </div>
        </div>
      )
    },
    {
      key: 'salesChannel',
      title: 'Channel',
      sortable: true,
      render: (val) => <span style={{ fontSize: '0.78rem' }}>{val}</span>
    },
    {
      key: 'quantity',
      title: 'Qty',
      align: 'center',
      sortable: true,
      render: (val) => <span className="fw-medium">{val}</span>
    },
    {
      key: 'netSales',
      title: 'Net Sales',
      align: 'right',
      sortable: true,
      render: (val) => (
        <span className="font-mono fw-bold" style={{ color: 'var(--text-primary)' }}>
          {formatCurrency(val)}
        </span>
      )
    },
    {
      key: 'netProfit',
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
      key: 'status',
      title: 'Status',
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
        <button
          type="button"
          onClick={() => setSelectedOrder(row)}
          className="btn btn-sm btn-ghost p-1 text-muted"
          title="View Order Details"
        >
          <Eye size={15} />
        </button>
      )
    }
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* 6 Key Sales Metrics */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-2">
          <KPICard
            title="Gross Sales"
            value={formatCurrency(currentMetrics.grossSales)}
            delta={{ percentChange: '+14.6%', trendType: 'positive' }}
            comparisonLabel="before discounts"
            tooltip="Total order value before promotional reductions and refunds."
            icon={DollarSign}
            sparklineData={[50, 55, 60, 58, 65, 72, 75, 80]}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-2">
          <KPICard
            title="Net Sales"
            value={formatCurrency(currentMetrics.netSales)}
            delta={kpiDeltas.revenueDelta}
            comparisonLabel="vs prior period"
            tooltip="Gross Sales minus discounts and refunded items."
            icon={TrendingUp}
            sparklineData={[42, 48, 52, 50, 58, 64, 68, 72]}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-2">
          <KPICard
            title="Total Orders"
            value={formatNumber(currentMetrics.totalOrders)}
            delta={kpiDeltas.ordersDelta}
            comparisonLabel="vs prior period"
            tooltip="Count of orders across all channels in active filters."
            icon={ShoppingBag}
            sparklineData={[30, 35, 32, 40, 44, 48, 50, 55]}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-2">
          <KPICard
            title="Avg Order Value"
            value={formatCurrency(currentMetrics.aov)}
            delta={kpiDeltas.aovDelta}
            comparisonLabel="vs prior period"
            tooltip="Net revenue generated per processed order."
            icon={Layers}
            sparklineData={[2100, 2200, 2300, 2250, 2400, 2450, 2500, 2550]}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-2">
          <KPICard
            title="Refund Amount"
            value={formatCurrency(currentMetrics.totalRefunds)}
            delta={{ percentChange: '-8.2%', trendType: 'positive' }}
            comparisonLabel="favorable trend"
            tooltip="Total dollar value refunded to clients upon request."
            icon={RotateCcw}
            invertTrendColor={true}
            sparklineData={[12, 10, 8, 9, 7, 6, 5, 4]}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-2">
          <KPICard
            title="Sales Growth"
            value="+14.2%"
            delta={{ percentChange: '+2.1%', trendType: 'positive' }}
            comparisonLabel="quarter-over-quarter"
            tooltip="Growth rate of commercial net revenue."
            icon={TrendingUp}
            sparklineData={[8, 9, 10, 11, 12, 13, 14, 14]}
          />
        </div>
      </div>

      {/* Analytical Charts: Sales Trend & Channel Performance */}
      <div className="row g-4">
        {/* Gross vs Net Trend */}
        <div className="col-12 col-lg-8">
          <ChartCard
            title="Gross vs Net Sales Over Time"
            subtitle="Comparing initial order value against net realized income"
          >
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={monthlySalesTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val, name) => [
                    formatCurrency(val),
                    name === 'gross' ? 'Gross Sales' : name === 'net' ? 'Net Sales' : 'Refunds'
                  ]}
                  contentStyle={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem'
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={30}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                />
                <Bar dataKey="gross" name="Gross Sales" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="net" name="Net Sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Order Status Distribution */}
        <div className="col-12 col-lg-4">
          <ChartCard
            title="Order Status Distribution"
            subtitle="Fulfillment and operational pipeline breakdown"
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`status-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} orders`, name]}
                  contentStyle={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="d-flex flex-wrap gap-2 justify-content-center mt-2">
              {statusDistribution.map((s) => (
                <div
                  key={s.name}
                  className="d-flex align-items-center gap-1.5 px-2 py-1 rounded-2"
                  style={{ backgroundColor: 'var(--bg-subtle)', fontSize: '0.725rem' }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color }} />
                  <span className="fw-medium">{s.name}:</span>
                  <span className="text-muted">{s.count}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Commercial Sales Order Table */}
      <DataTable
        title="Commercial Sales Orders"
        columns={columns}
        data={filteredOrders}
        defaultSortKey="orderDate"
        defaultSortDirection="desc"
        exportFilename="sales-orders.csv"
        searchPlaceholder="Search order ID, product, customer..."
      />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details — ${selectedOrder.id}`}
          subtitle={`Placed on ${selectedOrder.orderDate} by ${selectedOrder.customerName}`}
          size="lg"
          footer={
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="btn btn-primary px-3 py-1.5"
              style={{ backgroundColor: 'var(--brand-primary)', borderColor: 'var(--brand-primary)', fontSize: '0.85rem' }}
            >
              Close
            </button>
          }
        >
          <div className="d-flex flex-column gap-4">
            {/* Top Stat Summary */}
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <div className="text-muted" style={{ fontSize: '0.725rem' }}>STATUS</div>
                  <div className="mt-1"><StatusBadge status={selectedOrder.status} /></div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <div className="text-muted" style={{ fontSize: '0.725rem' }}>NET REVENUE</div>
                  <div className="fw-bold font-mono mt-1" style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    {formatCurrency(selectedOrder.netSales)}
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <div className="text-muted" style={{ fontSize: '0.725rem' }}>NET PROFIT</div>
                  <div className="fw-bold font-mono text-success mt-1" style={{ fontSize: '1.05rem' }}>
                    {formatCurrency(selectedOrder.netProfit)}
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <div className="text-muted" style={{ fontSize: '0.725rem' }}>MARGIN</div>
                  <div className="fw-bold font-mono mt-1" style={{ fontSize: '1.05rem', color: '#10b981' }}>
                    {formatPercent(selectedOrder.marginPercent)}
                  </div>
                </div>
              </div>
            </div>

            {/* Line Item Breakdown */}
            <div className="border rounded-2 p-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <h6 className="fw-bold mb-3" style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                Commercial Line Items
              </h6>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0" style={{ fontSize: '0.825rem' }}>
                  <thead>
                    <tr className="text-muted" style={{ fontSize: '0.75rem' }}>
                      <th>ITEM</th>
                      <th>CATEGORY</th>
                      <th className="text-center">QTY</th>
                      <th className="text-end">UNIT PRICE</th>
                      <th className="text-end">GROSS</th>
                      <th className="text-end">DISCOUNT</th>
                      <th className="text-end">NET</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-semibold">{selectedOrder.productName}</td>
                      <td>{selectedOrder.category}</td>
                      <td className="text-center">{selectedOrder.quantity}</td>
                      <td className="text-end font-mono">{formatCurrency(selectedOrder.unitPrice)}</td>
                      <td className="text-end font-mono">{formatCurrency(selectedOrder.grossAmount)}</td>
                      <td className="text-end font-mono text-danger">-{formatCurrency(selectedOrder.discountAmount)}</td>
                      <td className="text-end font-mono fw-bold">{formatCurrency(selectedOrder.netSales)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Account & Fulfillment Context */}
            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-3 rounded-2 border" style={{ borderColor: 'var(--border-subtle)', fontSize: '0.825rem' }}>
                  <div className="fw-bold mb-2 text-muted" style={{ fontSize: '0.75rem' }}>CUSTOMER PROFILE</div>
                  <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>{selectedOrder.customerName}</div>
                  <div className="text-muted">Account Tier: {selectedOrder.customerSegment}</div>
                  <div className="text-muted">Territory: {selectedOrder.region}</div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 rounded-2 border" style={{ borderColor: 'var(--border-subtle)', fontSize: '0.825rem' }}>
                  <div className="fw-bold mb-2 text-muted" style={{ fontSize: '0.75rem' }}>LOGISTICS & FULFILLMENT</div>
                  <div className="fw-semibold">Channel: {selectedOrder.salesChannel}</div>
                  <div className="text-muted">COGS Cost: {formatCurrency(selectedOrder.costOfGoodsSold)}</div>
                  <div className="text-muted">Est. Operating Expense: {formatCurrency(selectedOrder.operatingExpense)}</div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SalesAnalytics;
