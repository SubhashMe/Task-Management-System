import React, { useState, useMemo } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { KPICard } from '../components/KPICard';
import { ChartCard } from '../components/ChartCard';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { formatCurrency, formatNumber, formatPercent } from '../utils/currencyFormatter';
import {
  Users,
  UserCheck,
  UserPlus,
  Repeat,
  DollarSign,
  TrendingUp,
  Eye,
  Mail,
  Building,
  MapPin,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const CustomerAnalytics = () => {
  const { customers, filteredOrders, customerMetrics } = useAnalytics();
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // 1. Customer Segmentation by Revenue & Count
  const segmentData = useMemo(() => {
    const map = {};
    customers.forEach((c) => {
      if (!map[c.segment]) {
        map[c.segment] = { segment: c.segment, count: 0, revenue: 0 };
      }
      map[c.segment].count += 1;
      map[c.segment].revenue += c.totalSpend;
    });

    const colors = {
      Enterprise: '#4f46e5',
      'Mid-Market': '#06b6d4',
      SMB: '#10b981',
      Startup: '#f59e0b'
    };

    return Object.keys(map).map((s) => ({
      name: s,
      count: map[s].count,
      revenue: map[s].revenue,
      color: colors[s] || '#64748b'
    }));
  }, [customers]);

  // 2. Acquisition trend (cumulative monthly cohorts)
  const acquisitionTrend = useMemo(() => {
    const map = {};
    customers.forEach((c) => {
      const dateVal = c.joinedDate || c.firstPurchaseDate || '2024-01-01';
      const month = dateVal.slice(0, 7);
      map[month] = (map[month] || 0) + 1;
    });

    let cumulative = 0;
    return Object.keys(map)
      .sort()
      .map((m) => {
        cumulative += map[m];
        return {
          month: m,
          newAccounts: map[m],
          totalAccounts: cumulative
        };
      });
  }, [customers]);

  // Customer Table Columns
  const columns = [
    {
      key: 'id',
      title: 'Customer ID',
      sortable: true,
      render: (val, row) => (
        <button
          type="button"
          onClick={() => setSelectedCustomer(row)}
          className="btn btn-link p-0 font-mono fw-bold text-decoration-none"
          style={{ color: 'var(--brand-primary)', fontSize: '0.8rem' }}
        >
          {val}
        </button>
      )
    },
    {
      key: 'name',
      title: 'Customer Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
            {val}
          </div>
          <div className="text-muted" style={{ fontSize: '0.725rem' }}>
            {row.email}
          </div>
        </div>
      )
    },
    {
      key: 'segment',
      title: 'Segment',
      sortable: true,
      render: (val) => <StatusBadge status={val} size="sm" />
    },
    {
      key: 'region',
      title: 'Region',
      sortable: true,
      render: (val) => <span style={{ fontSize: '0.8rem' }}>{val}</span>
    },
    {
      key: 'ordersCount',
      title: 'Orders',
      align: 'center',
      sortable: true,
      render: (val) => <span className="fw-medium font-mono">{val}</span>
    },
    {
      key: 'totalSpend',
      title: 'Total Revenue',
      align: 'right',
      sortable: true,
      render: (val) => (
        <span className="font-mono fw-bold" style={{ color: 'var(--text-primary)' }}>
          {formatCurrency(val)}
        </span>
      )
    },
    {
      key: 'lastPurchaseDate',
      title: 'Last Active',
      sortable: true,
      render: (val) => <span className="font-mono text-muted">{val}</span>
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <button
          type="button"
          onClick={() => setSelectedCustomer(row)}
          className="btn btn-sm btn-ghost p-1 text-muted"
          title="View Client Details"
        >
          <Eye size={15} />
        </button>
      )
    }
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* 6 Customer Analytical KPIs */}
      <div className="row g-3">
        {/* Total Customers */}
        <div className="col-12 col-sm-6 col-lg-2">
          <KPICard
            title="Total Customers"
            value={formatNumber(customerMetrics.totalCustomers)}
            delta={{ percentChange: '+12.4%', trendType: 'positive' }}
            comparisonLabel="active portfolio"
            tooltip="Total unique corporate client accounts on record."
            icon={Users}
            sparklineData={[12, 14, 15, 17, 18, 19, 20, 20]}
          />
        </div>

        {/* New Customers */}
        <div className="col-12 col-sm-6 col-lg-2">
          <KPICard
            title="New Customers"
            value={formatNumber(customerMetrics.newCustomers)}
            delta={{ percentChange: '+8.0%', trendType: 'positive' }}
            comparisonLabel="first order < 90 days"
            tooltip="Recently acquired client organizations with first recorded purchases in last 90 days."
            icon={UserPlus}
            sparklineData={[2, 3, 3, 4, 3, 5, 4, 6]}
          />
        </div>

        {/* Returning Customers */}
        <div className="col-12 col-sm-6 col-lg-2">
          <KPICard
            title="Repeat Accounts"
            value={formatNumber(customerMetrics.returningCustomers)}
            delta={{ percentChange: '+14.5%', trendType: 'positive' }}
            comparisonLabel="multi-order accounts"
            tooltip="Clients who have executed two or more distinct purchases."
            icon={UserCheck}
            sparklineData={[8, 9, 10, 11, 12, 13, 14, 14]}
          />
        </div>

        {/* Repeat Purchase Rate */}
        <div className="col-12 col-sm-6 col-lg-2">
          <KPICard
            title="Repeat Rate"
            value={formatPercent(customerMetrics.repeatRate)}
            delta={{ percentChange: '+3.2%', trendType: 'positive' }}
            comparisonLabel="high loyalty score"
            tooltip="Percentage of customer accounts that have made repeat orders."
            icon={Repeat}
            sparklineData={[60, 62, 65, 64, 68, 69, 70, 70]}
          />
        </div>

        {/* Retention Rate */}
        <div className="col-12 col-sm-6 col-lg-2">
          <KPICard
            title="Retention Rate"
            value={formatPercent(customerMetrics.retentionRate)}
            delta={{ percentChange: '+1.5%', trendType: 'positive' }}
            comparisonLabel="annualized retention"
            tooltip="Accounts active in the past 180 days relative to overall historical client base."
            icon={Award}
            sparklineData={[80, 82, 83, 84, 85, 85, 85, 85]}
          />
        </div>

        {/* Average Customer Spend */}
        <div className="col-12 col-sm-6 col-lg-2">
          <KPICard
            title="Avg Client Spend"
            value={formatCurrency(customerMetrics.avgCustomerSpend)}
            delta={{ percentChange: '+11.8%', trendType: 'positive' }}
            comparisonLabel="lifetime revenue / client"
            tooltip="Average cumulative commercial revenue generated per account."
            icon={DollarSign}
            sparklineData={[28000, 31000, 34000, 36000, 39000, 42000, 45000, 48000]}
          />
        </div>
      </div>

      {/* Row 2: Customer Acquisition & Segmentation Charts */}
      <div className="row g-4">
        {/* Acquisition & Account Growth */}
        <div className="col-12 col-lg-7">
          <ChartCard
            title="Customer Base Expansion Trajectory"
            subtitle="Cumulative active corporate client accounts over time"
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={acquisitionTrend} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val, name) => [
                    val,
                    name === 'totalAccounts' ? 'Total Active Accounts' : 'New Signups'
                  ]}
                  contentStyle={{
                    backgroundColor: '#181a26',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    color: '#ffffff',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={30}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                />
                <Line
                  type="monotone"
                  dataKey="totalAccounts"
                  name="Cumulative Accounts"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: 'var(--primary)' }}
                />
                <Line
                  type="monotone"
                  dataKey="newAccounts"
                  name="Monthly New Accounts"
                  stroke="var(--accent-mint)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--accent-mint)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Revenue by Customer Segment */}
        <div className="col-12 col-lg-5">
          <ChartCard
            title="Revenue by Customer Segment"
            subtitle="Monetary contribution by organizational tier"
          >
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={segmentData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#181a26',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    color: '#ffffff',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
                  }}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {segmentData.map((entry, index) => (
                    <Cell key={`seg-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="d-flex flex-wrap gap-2 justify-content-center mt-2">
              {segmentData.map((s) => (
                <div
                  key={s.name}
                  className="d-flex align-items-center gap-1.5 px-2 py-1 rounded-2"
                  style={{ backgroundColor: 'var(--bg-subtle)', fontSize: '0.725rem' }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color }} />
                  <span className="fw-medium">{s.name}:</span>
                  <span className="text-muted">{s.count} accounts</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Customer Directory Table */}
      <DataTable
        title="Enterprise Client Directory"
        columns={columns}
        data={customers}
        defaultSortKey="totalSpend"
        defaultSortDirection="desc"
        exportFilename="customers.csv"
        searchPlaceholder="Search customer, email, region..."
      />

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={Boolean(selectedCustomer)}
          onClose={() => setSelectedCustomer(null)}
          title={`Client Profile: ${selectedCustomer.name}`}
          subtitle={`Account ID: ${selectedCustomer.id} • Registered ${selectedCustomer.joinedDate || selectedCustomer.firstPurchaseDate || 'Active'}`}
          size="md"
          footer={
            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="btn btn-primary px-3 py-1.5"
              style={{ backgroundColor: 'var(--brand-primary)', borderColor: 'var(--brand-primary)', fontSize: '0.85rem' }}
            >
              Done
            </button>
          }
        >
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center justify-content-between p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
              <div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>TOTAL LIFETIME SPEND</div>
                <div className="fw-bold font-mono text-primary" style={{ fontSize: '1.4rem', color: 'var(--brand-primary)' }}>
                  {formatCurrency(selectedCustomer.totalSpend)}
                </div>
              </div>
              <div className="text-end">
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>TOTAL ORDERS</div>
                <div className="fw-bold font-mono" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                  {selectedCustomer.totalOrders ?? selectedCustomer.ordersCount ?? 0}
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-2" style={{ borderColor: 'var(--border-subtle)', fontSize: '0.825rem' }}>
              <div className="row g-2">
                <div className="col-6">
                  <span className="text-muted">Contact:</span>
                  <div className="fw-semibold">{selectedCustomer.email}</div>
                </div>
                <div className="col-6">
                  <span className="text-muted">Account Tier:</span>
                  <div><StatusBadge status={selectedCustomer.segment} size="sm" /></div>
                </div>
                <div className="col-6 mt-2">
                  <span className="text-muted">Territory:</span>
                  <div className="fw-semibold">{selectedCustomer.region}</div>
                </div>
                <div className="col-6 mt-2">
                  <span className="text-muted">Last Purchase:</span>
                  <div className="fw-semibold font-mono">{selectedCustomer.lastPurchaseDate}</div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CustomerAnalytics;
