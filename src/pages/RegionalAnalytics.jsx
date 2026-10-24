import React, { useState, useMemo } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { KPICard } from '../components/KPICard';
import { ChartCard } from '../components/ChartCard';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { formatCurrency, formatNumber, formatPercent } from '../utils/currencyFormatter';
import {
  Globe,
  TrendingUp,
  DollarSign,
  Award,
  AlertCircle,
  Eye,
  MapPin,
  ShoppingBag,
  Target
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const RegionalAnalytics = () => {
  const { regions, filteredOrders, customers } = useAnalytics();
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Aggregate metrics per region
  const regionalMetrics = useMemo(() => {
    const map = {};
    regions.forEach((r) => {
      map[r.name] = {
        id: r.id,
        name: r.name,
        code: r.code,
        revenueTarget: r.revenueTarget,
        revenue: 0,
        profit: 0,
        orders: 0,
        categories: {}
      };
    });

    filteredOrders.forEach((o) => {
      if (map[o.region]) {
        map[o.region].revenue += o.netSales;
        map[o.region].profit += o.netProfit;
        map[o.region].orders += 1;
        map[o.region].categories[o.category] = (map[o.region].categories[o.category] || 0) + o.netSales;
      }
    });

    return Object.values(map).map((reg) => {
      const margin = reg.revenue > 0 ? Number(((reg.profit / reg.revenue) * 100).toFixed(1)) : 0;
      const targetAttainment = reg.revenueTarget > 0 ? Number(((reg.revenue / reg.revenueTarget) * 100).toFixed(1)) : 0;
      const accountsCount = customers.filter((c) => c.region === reg.name).length;

      return {
        ...reg,
        margin,
        targetAttainment,
        accountsCount
      };
    });
  }, [regions, filteredOrders, customers]);

  // Best & Lowest Performing Regions
  const sortedByRevenue = [...regionalMetrics].sort((a, b) => b.revenue - a.revenue);
  const bestRegion = sortedByRevenue[0] || {};
  const lowestRegion = sortedByRevenue[sortedByRevenue.length - 1] || {};

  // Chart Data
  const chartData = useMemo(() => {
    return regionalMetrics.map((r) => ({
      name: r.name,
      revenue: r.revenue,
      profit: r.profit,
      target: r.revenueTarget
    }));
  }, [regionalMetrics]);

  // Table Columns
  const columns = [
    {
      key: 'name',
      title: 'Territory',
      sortable: true,
      render: (val, row) => (
        <button
          type="button"
          onClick={() => setSelectedRegion(row)}
          className="btn btn-link p-0 fw-semibold text-decoration-none text-start"
          style={{ color: 'var(--brand-primary)', fontSize: '0.85rem' }}
        >
          {val} ({row.code})
        </button>
      )
    },
    {
      key: 'revenue',
      title: 'Net Revenue',
      align: 'right',
      sortable: true,
      render: (val) => (
        <span className="font-mono fw-bold" style={{ color: 'var(--text-primary)' }}>
          {formatCurrency(val)}
        </span>
      )
    },
    {
      key: 'revenueTarget',
      title: 'Target',
      align: 'right',
      sortable: true,
      render: (val) => <span className="font-mono text-muted">{formatCurrency(val)}</span>
    },
    {
      key: 'targetAttainment',
      title: 'Attainment',
      align: 'right',
      sortable: true,
      render: (val) => (
        <span
          className="badge"
          style={{
            backgroundColor: val >= 85 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: val >= 85 ? '#10b981' : '#f59e0b',
            fontWeight: 700
          }}
        >
          {val}%
        </span>
      )
    },
    {
      key: 'profit',
      title: 'Net Profit',
      align: 'right',
      sortable: true,
      render: (val) => <span className="font-mono text-success fw-semibold">{formatCurrency(val)}</span>
    },
    {
      key: 'margin',
      title: 'Margin',
      align: 'right',
      sortable: true,
      render: (val) => <span className="font-mono fw-bold text-success">{formatPercent(val)}</span>
    },
    {
      key: 'orders',
      title: 'Orders',
      align: 'center',
      sortable: true,
      render: (val) => <span className="font-mono fw-medium">{val}</span>
    },
    {
      key: 'accountsCount',
      title: 'Clients',
      align: 'center',
      sortable: true,
      render: (val) => <span className="font-mono">{val}</span>
    },
    {
      key: 'actions',
      title: 'Details',
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <button
          type="button"
          onClick={() => setSelectedRegion(row)}
          className="btn btn-sm btn-ghost p-1 text-muted"
          title="Inspect Regional Territory"
        >
          <Eye size={15} />
        </button>
      )
    }
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* 4 Regional Summary Cards */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <KPICard
            title="Leading Territory"
            value={bestRegion.name || 'North America'}
            delta={{ percentChange: formatCurrency(bestRegion.revenue || 0), trendType: 'positive' }}
            comparisonLabel="highest revenue"
            tooltip="Territory with the highest commercial net revenue contribution."
            icon={Award}
            sparklineData={[40, 50, 60, 65, 75, 85, 95, 110]}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <KPICard
            title="Opportunity Territory"
            value={lowestRegion.name || 'Middle East & Africa'}
            delta={{ percentChange: `${lowestRegion.targetAttainment || 0}% goal`, trendType: 'neutral' }}
            comparisonLabel="growth potential"
            tooltip="Developing geographic region with expanding enterprise pipeline."
            icon={Target}
            sparklineData={[10, 12, 14, 16, 18, 20, 22, 25]}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <KPICard
            title="Total Territories"
            value={`${regions.length} Regions`}
            delta={{ percentChange: '100% active', trendType: 'positive' }}
            comparisonLabel="global sales presence"
            tooltip="Active operating corporate geographic divisions."
            icon={Globe}
            sparklineData={[5, 5, 5, 5, 5, 5, 5, 5]}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <KPICard
            title="Average Target Attainment"
            value={`${(
              regionalMetrics.reduce((acc, r) => acc + r.targetAttainment, 0) /
              (regionalMetrics.length || 1)
            ).toFixed(1)}%`}
            delta={{ percentChange: '+4.2%', trendType: 'positive' }}
            comparisonLabel="vs quarterly budget"
            tooltip="Average regional sales attainment against corporate targets."
            icon={TrendingUp}
            sparklineData={[75, 78, 80, 82, 85, 86, 88, 90]}
          />
        </div>
      </div>

      {/* Regional Comparison Chart */}
      <ChartCard
        title="Territory Performance vs Commercial Quota"
        subtitle="Comparing Actual Net Revenue against Corporate Budget Target"
      >
        <ResponsiveContainer width="100%" height={290}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(val, name) => [
                formatCurrency(val),
                name === 'revenue' ? 'Actual Revenue' : name === 'target' ? 'Revenue Quota' : 'Net Profit'
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
            <Bar dataKey="revenue" name="Actual Net Revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" name="Revenue Quota" fill="rgba(255, 255, 255, 0.2)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" name="Net Profit" fill="var(--accent-mint)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Regional Performance Table */}
      <DataTable
        title="Regional Operating Performance"
        columns={columns}
        data={regionalMetrics}
        defaultSortKey="revenue"
        defaultSortDirection="desc"
        exportFilename="regional-performance.csv"
        searchPlaceholder="Filter region by name..."
      />

      {/* Regional Drill-down Detail Modal */}
      {selectedRegion && (
        <Modal
          isOpen={Boolean(selectedRegion)}
          onClose={() => setSelectedRegion(null)}
          title={`Territory Drill-down: ${selectedRegion.name} (${selectedRegion.code})`}
          subtitle={`Attainment: ${selectedRegion.targetAttainment}% of ${formatCurrency(selectedRegion.revenueTarget)} Target`}
          size="md"
          footer={
            <button
              type="button"
              onClick={() => setSelectedRegion(null)}
              className="btn btn-primary px-4 py-1.5 text-white"
              style={{
                backgroundColor: 'var(--primary)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(255, 90, 95, 0.35)'
              }}
            >
              Done
            </button>
          }
        >
          <div className="d-flex flex-column gap-3">
            <div className="row g-2">
              <div className="col-6">
                <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <span className="text-secondary" style={{ fontSize: '0.75rem' }}>TOTAL SALES</span>
                  <div className="fw-bold font-mono text-white" style={{ fontSize: '1.25rem' }}>
                    {formatCurrency(selectedRegion.revenue)}
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>NET PROFIT</span>
                  <div className="fw-bold font-mono text-success" style={{ fontSize: '1.25rem' }}>
                    {formatCurrency(selectedRegion.profit)}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-2" style={{ borderColor: 'var(--border-subtle)', fontSize: '0.825rem' }}>
              <div className="fw-bold mb-2 text-muted" style={{ fontSize: '0.75rem' }}>TOP CATEGORIES IN REGION</div>
              {Object.entries(selectedRegion.categories || {}).length > 0 ? (
                Object.entries(selectedRegion.categories)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([cat, val]) => (
                    <div key={cat} className="d-flex justify-content-between py-1 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
                      <span>{cat}</span>
                      <span className="font-mono fw-semibold">{formatCurrency(val)}</span>
                    </div>
                  ))
              ) : (
                <div className="text-muted">No regional category breakdown recorded</div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RegionalAnalytics;
