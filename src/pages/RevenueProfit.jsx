import React, { useMemo } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { KPICard } from '../components/KPICard';
import { ChartCard } from '../components/ChartCard';
import { formatCurrency, formatPercent } from '../utils/currencyFormatter';
import {
  DollarSign,
  TrendingUp,
  Percent,
  PieChart as PieIcon,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
  ArrowDownRight,
  Layers,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const RevenueProfit = () => {
  const { filteredOrders, currentMetrics, categories } = useAnalytics();

  // 1. Monthly Financial Income Analysis
  const monthlyFinancials = useMemo(() => {
    const map = {};
    filteredOrders.forEach((o) => {
      const month = o.orderDate.slice(0, 7);
      if (!map[month]) {
        map[month] = {
          month,
          revenue: 0,
          cogs: 0,
          grossProfit: 0,
          opex: 0,
          netProfit: 0
        };
      }
      map[month].revenue += o.netSales;
      map[month].cogs += o.costOfGoodsSold;
      map[month].grossProfit += o.grossProfit;
      map[month].opex += o.operatingExpense;
      map[month].netProfit += o.netProfit;
    });

    return Object.keys(map)
      .sort()
      .map((m) => {
        const row = map[m];
        return {
          ...row,
          grossMargin: row.revenue > 0 ? Number(((row.grossProfit / row.revenue) * 100).toFixed(1)) : 0,
          netMargin: row.revenue > 0 ? Number(((row.netProfit / row.revenue) * 100).toFixed(1)) : 0
        };
      });
  }, [filteredOrders]);

  // 2. Category Profitability Breakdown
  const categoryProfitability = useMemo(() => {
    const map = {};
    filteredOrders.forEach((o) => {
      if (!map[o.category]) {
        map[o.category] = { category: o.category, revenue: 0, cogs: 0, profit: 0 };
      }
      map[o.category].revenue += o.netSales;
      map[o.category].cogs += o.costOfGoodsSold;
      map[o.category].profit += o.netProfit;
    });

    return Object.values(map)
      .map((row) => ({
        ...row,
        margin: row.revenue > 0 ? Number(((row.profit / row.revenue) * 100).toFixed(1)) : 0
      }))
      .sort((a, b) => b.profit - a.profit);
  }, [filteredOrders]);

  return (
    <div className="d-flex flex-column gap-4">
      {/* Financial Accounting Disclaimer Banner */}
      <div
        className="p-3 p-md-4 rounded-4 d-flex align-items-center justify-content-between gap-3"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div className="d-flex align-items-center gap-2.5">
          <ShieldCheck size={20} color="var(--primary)" />
          <div>
            <span className="fw-semibold text-white" style={{ fontSize: '0.85rem' }}>
              Standard Commercial Accounting Model:
            </span>
            <span className="text-secondary ms-1" style={{ fontSize: '0.8rem' }}>
              Net Sales = Gross Sales − (Discounts + Refunds) | Gross Profit = Net Sales − COGS | Net Profit = Gross Profit − OpEx (18%).
            </span>
          </div>
        </div>
        <span
          className="badge rounded-pill d-none d-md-inline"
          style={{
            backgroundColor: 'rgba(255, 90, 95, 0.12)',
            color: '#ff7e82',
            border: '1px solid rgba(255, 90, 95, 0.25)',
            fontSize: '0.72rem',
            padding: '4px 12px'
          }}
        >
          Accrual Basis
        </span>
      </div>

      {/* 8 Financial Executive KPIs */}
      <div className="row g-3">
        {/* Gross Revenue */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Gross Revenue"
            value={formatCurrency(currentMetrics.grossSales)}
            delta={{ percentChange: '+14.6%', trendType: 'positive' }}
            comparisonLabel="total billed value"
            tooltip="Aggregate transaction billings before discounts or customer returns."
            icon={DollarSign}
            sparklineData={[40, 44, 48, 52, 58, 64, 70, 78]}
          />
        </div>

        {/* Net Revenue */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Net Revenue"
            value={formatCurrency(currentMetrics.netSales)}
            delta={{ percentChange: '+12.4%', trendType: 'positive' }}
            comparisonLabel="realized commercial income"
            tooltip="Gross sales minus promotional rebates and refunds."
            icon={TrendingUp}
            sparklineData={[36, 40, 42, 48, 52, 59, 64, 71]}
          />
        </div>

        {/* COGS */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Cost of Goods (COGS)"
            value={formatCurrency(currentMetrics.totalCOGS)}
            delta={{ percentChange: '+9.8%', trendType: 'negative' }}
            comparisonLabel="direct product delivery cost"
            tooltip="Direct production, cloud hosting, and licensing costs."
            icon={Layers}
            invertTrendColor={true}
            sparklineData={[20, 22, 24, 25, 28, 32, 35, 38]}
          />
        </div>

        {/* Operating Expenses */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Operating Expenses (OpEx)"
            value={formatCurrency(currentMetrics.totalOpEx)}
            delta={{ percentChange: '+11.2%', trendType: 'neutral' }}
            comparisonLabel="overhead & administration"
            tooltip="Selling, general, and administrative operating overhead (est. 18% of sales)."
            icon={Activity}
            sparklineData={[7, 8, 8, 9, 10, 11, 12, 13]}
          />
        </div>

        {/* Gross Profit */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Gross Profit"
            value={formatCurrency(currentMetrics.grossProfit)}
            delta={{ percentChange: '+14.1%', trendType: 'positive' }}
            comparisonLabel="sales minus COGS"
            tooltip="Revenue retained after covering direct product delivery expenses."
            icon={DollarSign}
            sparklineData={[16, 18, 19, 23, 26, 28, 30, 34]}
          />
        </div>

        {/* Net Profit */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Net Profit"
            value={formatCurrency(currentMetrics.netProfit)}
            delta={{ percentChange: '+15.2%', trendType: 'positive' }}
            comparisonLabel="bottom-line income"
            tooltip="Residual income available for reinvestment or dividend distributions."
            icon={TrendingUp}
            sparklineData={[9, 10, 11, 14, 16, 17, 18, 21]}
          />
        </div>

        {/* Gross Margin */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Gross Margin"
            value={formatPercent(currentMetrics.grossMargin)}
            delta={{ percentChange: '+1.4%', trendType: 'positive' }}
            comparisonLabel="target 45%"
            tooltip="Gross profit expressed as a percentage of net sales."
            icon={Percent}
            sparklineData={[44, 45, 46, 45, 47, 47, 48, 48]}
          />
        </div>

        {/* Net Profit Margin */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Net Profit Margin"
            value={formatPercent(currentMetrics.netMargin)}
            delta={{ percentChange: '+0.8%', trendType: 'positive' }}
            comparisonLabel="target 20%"
            tooltip="Net profit expressed as a percentage of net sales."
            icon={Percent}
            sparklineData={[22, 23, 22, 24, 25, 24, 25, 25]}
          />
        </div>
      </div>

      {/* Row 2: Revenue vs Cost & Expenses + Profit Margin Trends */}
      <div className="row g-4">
        {/* Revenue vs Cost Stacked Bar */}
        <div className="col-12 col-xl-7">
          <ChartCard
            title="Revenue vs Cost Structure (Monthly)"
            subtitle="Comparing Net Revenue with COGS and Operating Expenses"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyFinancials} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                    name === 'revenue'
                      ? 'Net Revenue'
                      : name === 'cogs'
                      ? 'COGS'
                      : name === 'opex'
                      ? 'OpEx'
                      : 'Net Profit'
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
                <Bar dataKey="revenue" name="Net Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cogs" name="COGS" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="opex" name="OpEx" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Profit Margin Trends (%) */}
        <div className="col-12 col-xl-5">
          <ChartCard
            title="Profit Margin Dynamics (%)"
            subtitle="Gross vs Net Margin historical trends"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyFinancials} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  domain={[0, 60]}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  formatter={(val, name) => [
                    `${val}%`,
                    name === 'grossMargin' ? 'Gross Margin' : 'Net Margin'
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
                <Line
                  type="monotone"
                  dataKey="grossMargin"
                  name="Gross Margin %"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="netMargin"
                  name="Net Margin %"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Row 3: Category-Wise Profitability Table */}
      <div
        className="card p-3 p-md-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h6 className="fw-bold mb-0" style={{ color: '#ffffff', fontSize: '0.95rem' }}>
              Category Profitability &amp; Contribution
            </h6>
            <p className="text-secondary mb-0" style={{ fontSize: '0.775rem' }}>
              Detailed financial reconciliation of margins per solution vertical
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0" style={{ borderColor: 'var(--border-color)' }}>
            <thead style={{ backgroundColor: '#171924' }}>
              <tr>
                <th style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CATEGORY</th>
                <th style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="text-end">NET SALES</th>
                <th style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="text-end">DIRECT COGS</th>
                <th style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="text-end">NET PROFIT</th>
                <th style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="text-end">MARGIN</th>
                <th style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="text-center">PROFITABILITY TIER</th>
              </tr>
            </thead>
            <tbody>
              {categoryProfitability.map((cat) => (
                <tr key={cat.category} className="table-row-hover">
                  <td className="fw-semibold text-white" style={{ fontSize: '0.85rem' }}>
                    {cat.category}
                  </td>
                  <td className="text-end font-mono fw-bold" style={{ fontSize: '0.84rem' }}>
                    {formatCurrency(cat.revenue)}
                  </td>
                  <td className="text-end font-mono text-muted" style={{ fontSize: '0.84rem' }}>
                    {formatCurrency(cat.cogs)}
                  </td>
                  <td className="text-end font-mono text-success fw-semibold" style={{ fontSize: '0.84rem' }}>
                    {formatCurrency(cat.profit)}
                  </td>
                  <td className="text-end font-mono fw-bold" style={{ fontSize: '0.84rem', color: '#10b981' }}>
                    {formatPercent(cat.margin)}
                  </td>
                  <td className="text-center">
                    <span
                      className="badge px-2.5 py-1 rounded-pill"
                      style={{
                        backgroundColor: cat.margin >= 25 ? 'rgba(16, 185, 129, 0.14)' : 'rgba(255, 90, 95, 0.14)',
                        color: cat.margin >= 25 ? '#34d399' : '#ff7e82',
                        border: cat.margin >= 25 ? '1px solid rgba(16, 185, 129, 0.28)' : '1px solid rgba(255, 90, 95, 0.28)',
                        fontSize: '0.74rem',
                        fontWeight: 600
                      }}
                    >
                      {cat.margin >= 25 ? 'High Yield' : 'Core Business'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueProfit;
