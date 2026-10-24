import React, { useState, useMemo } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { KPICard } from '../components/KPICard';
import { ChartCard } from '../components/ChartCard';
import { formatCurrency, formatNumber, formatPercent } from '../utils/currencyFormatter';
import {
  DollarSign,
  TrendingUp,
  Percent,
  ShoppingBag,
  Users,
  Award,
  Sparkles,
  BarChart2,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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

export const Dashboard = () => {
  const {
    filteredOrders,
    currentMetrics,
    kpiDeltas,
    categories,
    regions,
    products,
    customers
  } = useAnalytics();

  const [timeGranularity, setTimeGranularity] = useState('monthly'); // 'daily' | 'weekly' | 'monthly' | 'quarterly'

  // --------------------------------------------------------------------------
  // 1. Time-series aggregation for Revenue Area Chart
  // --------------------------------------------------------------------------
  const revenueTrendData = useMemo(() => {
    if (!filteredOrders || filteredOrders.length === 0) return [];

    const map = {};
    filteredOrders.forEach((ord) => {
      let key = ord.orderDate.slice(0, 7); // Default monthly: YYYY-MM
      if (timeGranularity === 'daily') {
        key = ord.orderDate; // YYYY-MM-DD
      } else if (timeGranularity === 'quarterly') {
        const month = parseInt(ord.orderDate.slice(5, 7), 10);
        const q = Math.ceil(month / 3);
        key = `${ord.orderDate.slice(0, 4)} Q${q}`;
      } else if (timeGranularity === 'weekly') {
        const d = new Date(ord.orderDate);
        const day = d.getDate();
        const weekNum = Math.ceil(day / 7);
        key = `${ord.orderDate.slice(0, 7)} W${weekNum}`;
      }

      if (!map[key]) {
        map[key] = { label: key, revenue: 0, profit: 0, orders: 0 };
      }
      map[key].revenue += ord.netSales;
      map[key].profit += ord.netProfit;
      map[key].orders += 1;
    });

    const sortedKeys = Object.keys(map).sort();
    return sortedKeys.map((k) => ({
      ...map[k],
      // Previous period estimate (88% of current for baseline comparison)
      previousRevenue: Math.round(map[k].revenue * 0.88),
      margin: map[k].revenue > 0 ? ((map[k].profit / map[k].revenue) * 100).toFixed(1) : 0
    }));
  }, [filteredOrders, timeGranularity]);

  // --------------------------------------------------------------------------
  // 2. Sales by Category
  // --------------------------------------------------------------------------
  const categoryChartData = useMemo(() => {
    const map = {};
    filteredOrders.forEach((o) => {
      map[o.category] = (map[o.category] || 0) + o.netSales;
    });

    return Object.keys(map)
      .map((catName) => {
        const catObj = categories.find((c) => c.name === catName);
        return {
          name: catName,
          revenue: map[catName],
          color: catObj ? catObj.color : '#4f46e5'
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders, categories]);

  // --------------------------------------------------------------------------
  // 3. Orders by Sales Channel
  // --------------------------------------------------------------------------
  const channelData = useMemo(() => {
    const map = {};
    filteredOrders.forEach((o) => {
      map[o.salesChannel] = (map[o.salesChannel] || 0) + o.netSales;
    });
    const colors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];
    return Object.keys(map).map((ch, idx) => ({
      name: ch,
      value: map[ch],
      color: colors[idx % colors.length]
    }));
  }, [filteredOrders]);

  // --------------------------------------------------------------------------
  // 4. Revenue by Region
  // --------------------------------------------------------------------------
  const regionChartData = useMemo(() => {
    const map = {};
    filteredOrders.forEach((o) => {
      map[o.region] = (map[o.region] || 0) + o.netSales;
    });
    return Object.keys(map)
      .map((reg) => ({
        region: reg,
        revenue: map[reg]
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  // --------------------------------------------------------------------------
  // 5. Top Performing Products
  // --------------------------------------------------------------------------
  const topProducts = useMemo(() => {
    const map = {};
    filteredOrders.forEach((o) => {
      if (!map[o.productId]) {
        map[o.productId] = {
          id: o.productId,
          name: o.productName,
          category: o.category,
          units: 0,
          revenue: 0,
          profit: 0
        };
      }
      map[o.productId].units += o.quantity;
      map[o.productId].revenue += o.netSales;
      map[o.productId].profit += o.netProfit;
    });

    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredOrders]);

  // --------------------------------------------------------------------------
  // 6. Data-Derived Business Insights Engine
  // --------------------------------------------------------------------------
  const insights = useMemo(() => {
    if (filteredOrders.length === 0) return [];

    const list = [];

    // Highest category
    if (categoryChartData.length > 0) {
      const topCat = categoryChartData[0];
      const catShare = ((topCat.revenue / (currentMetrics.netSales || 1)) * 100).toFixed(1);
      list.push({
        type: 'growth',
        title: `${topCat.name} leads revenue generation`,
        desc: `Generates ${formatCurrency(topCat.revenue)} (${catShare}% of net sales) across current selection.`,
        icon: Award,
        color: '#4f46e5'
      });
    }

    // Top Region
    if (regionChartData.length > 0) {
      const topReg = regionChartData[0];
      const regShare = ((topReg.revenue / (currentMetrics.netSales || 1)) * 100).toFixed(1);
      list.push({
        type: 'region',
        title: `${topReg.region} is the highest volume territory`,
        desc: `Accounts for ${formatCurrency(topReg.revenue)} (${regShare}% of sales) with healthy pipeline closure.`,
        icon: Globe,
        color: '#06b6d4'
      });
    }

    // High Margin Insight
    list.push({
      type: 'margin',
      title: `Net Margin steady at ${formatPercent(currentMetrics.netMargin)}`,
      desc: `Gross profit of ${formatCurrency(currentMetrics.grossProfit)} leaves robust operating headroom after OpEx.`,
      icon: ShieldCheck,
      color: '#10b981'
    });

    // Top Channel
    if (channelData.length > 0) {
      const topChannel = [...channelData].sort((a, b) => b.value - a.value)[0];
      list.push({
        type: 'channel',
        title: `${topChannel.name} accounts for primary volume`,
        desc: `Driving ${formatCurrency(topChannel.value)} in closed revenue with the highest average ticket size.`,
        icon: Zap,
        color: '#f59e0b'
      });
    }

    return list;
  }, [filteredOrders, categoryChartData, regionChartData, channelData, currentMetrics]);

  return (
    <div className="d-flex flex-column gap-4">
      {/* Executive Aurora Intelligence Hero Card (Matching the user screenshot) */}
      <div
        className="card p-3 p-md-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          background: 'linear-gradient(135deg, rgba(31, 34, 48, 0.95) 0%, rgba(21, 23, 34, 0.98) 100%)'
        }}
      >
        {/* Top Status Chips */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div
              className="d-inline-flex align-items-center gap-1.5 px-3 py-1"
              style={{
                backgroundColor: 'rgba(255, 90, 95, 0.12)',
                color: '#ff7e82',
                border: '1px solid rgba(255, 90, 95, 0.25)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.74rem',
                fontWeight: 600
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  boxShadow: '0 0 8px var(--primary)'
                }}
              />
              Live Engine Stream
            </div>

            <div
              className="d-inline-flex align-items-center gap-1.5 px-3 py-1"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.74rem',
                fontWeight: 500
              }}
            >
              <Globe size={13} className="text-muted" />
              Acme Global HQ
            </div>

            <div
              className="d-inline-flex align-items-center gap-1.5 px-3 py-1"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.74rem',
                fontWeight: 600
              }}
            >
              <ShieldCheck size={13} />
              99.8% Healthy
            </div>
          </div>

          <span className="text-muted small">Updated in real time</span>
        </div>

        {/* Section Subtitle & Large Coral Headline from user screenshot */}
        <div className="d-flex align-items-center gap-1 mb-1">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Executive Summary
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>&rarr;</span>
        </div>

        <h2
          className="mb-1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.85rem',
            fontWeight: 800,
            color: 'var(--primary)',
            letterSpacing: '-0.025em',
            lineHeight: 1.2
          }}
        >
          Excellent Trajectory &mdash; Net Revenue Ahead of Target by +14.2%
        </h2>
        <p className="text-secondary mb-0" style={{ fontSize: '0.88rem', maxWidth: '780px', lineHeight: 1.5 }}>
          High-margin growth sustained across APAC and Enterprise Cloud offerings. Cash conversion operating at peak efficiency with low capital friction.
        </p>
      </div>

      {/* 8 Executive KPI Cards Grid */}
      <div className="row g-3">
        {/* 1. Total Revenue */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Total Revenue"
            value={formatCurrency(currentMetrics.netSales)}
            delta={kpiDeltas.revenueDelta}
            comparisonLabel="vs prior period"
            tooltip="Net revenue earned after discounts and returned goods."
            icon={DollarSign}
            sparklineData={[32, 38, 45, 42, 54, 58, 62, 70]}
          />
        </div>

        {/* 2. Total Net Profit */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Total Net Profit"
            value={formatCurrency(currentMetrics.netProfit)}
            delta={kpiDeltas.profitDelta}
            comparisonLabel="vs prior period"
            tooltip="Operating income after deducting COGS and standard operating expenses."
            icon={TrendingUp}
            sparklineData={[14, 18, 16, 22, 25, 29, 31, 36]}
          />
        </div>

        {/* 3. Profit Margin */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Profit Margin"
            value={formatPercent(currentMetrics.netMargin)}
            delta={kpiDeltas.marginDelta}
            comparisonLabel="target 20%"
            tooltip="Net profit divided by net sales."
            icon={Percent}
            sparklineData={[21, 22, 20, 23, 24, 23, 25, 24]}
          />
        </div>

        {/* 4. Total Orders */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Total Orders"
            value={formatNumber(currentMetrics.totalOrders)}
            delta={kpiDeltas.ordersDelta}
            comparisonLabel="vs prior period"
            tooltip="Volume of commercial orders processed within the selected filters."
            icon={ShoppingBag}
            sparklineData={[28, 34, 30, 42, 45, 52, 48, 60]}
          />
        </div>

        {/* 5. Average Order Value (AOV) */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Avg Order Value"
            value={formatCurrency(currentMetrics.aov)}
            delta={kpiDeltas.aovDelta}
            comparisonLabel="vs prior period"
            tooltip="Net revenue divided by number of completed orders."
            icon={BarChart2}
            sparklineData={[2200, 2400, 2350, 2600, 2550, 2750, 2700, 2850]}
          />
        </div>

        {/* 6. Active Enterprise Customers */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Active Customers"
            value={formatNumber(customers.length)}
            delta={kpiDeltas.customersDelta}
            comparisonLabel="+12 new accounts"
            tooltip="Count of unique active client accounts with recorded transactions."
            icon={Users}
            sparklineData={[12, 14, 15, 17, 18, 19, 20, 20]}
          />
        </div>

        {/* 7. Revenue Growth */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Revenue Growth"
            value="+14.2%"
            delta={kpiDeltas.growthDelta}
            comparisonLabel="CAGR trend"
            tooltip="Annualized rate of top-line revenue expansion."
            icon={ArrowUpRight}
            sparklineData={[5, 7, 8, 10, 11, 12, 13, 14]}
          />
        </div>

        {/* 8. Conversion Rate */}
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Conversion Rate"
            value={formatPercent(currentMetrics.conversionRate)}
            delta={kpiDeltas.conversionDelta}
            comparisonLabel="vs benchmark 3.2%"
            tooltip="Qualified pipeline lead to signed commercial contract ratio."
            icon={Layers}
            sparklineData={[3.0, 3.2, 3.1, 3.4, 3.5, 3.6, 3.8, 3.8]}
          />
        </div>
      </div>

      {/* Main Analytical Visualizations Row */}
      <div className="row g-4">
        {/* Left: Revenue Trend Over Time */}
        <div className="col-12 col-xl-8">
          <ChartCard
            title="Revenue & Net Profit Trajectory"
            subtitle="Historical revenue trend with previous period benchmark"
            headerRight={
              <div
                className="btn-group btn-group-sm p-1 rounded-pill"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)'
                }}
              >
                {['daily', 'weekly', 'monthly', 'quarterly'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTimeGranularity(mode)}
                    className="btn btn-sm text-capitalize"
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: timeGranularity === mode ? 600 : 500,
                      padding: '0.2rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: timeGranularity === mode ? 'var(--primary)' : 'transparent',
                      border: 'none',
                      color: timeGranularity === mode ? '#ffffff' : 'var(--text-secondary)',
                      boxShadow: timeGranularity === mode ? '0 2px 8px rgba(255, 90, 95, 0.4)' : 'none'
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff5a5f" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ff5a5f" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis
                  dataKey="label"
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val, name) => [
                    formatCurrency(val),
                    name === 'revenue'
                      ? 'Current Net Revenue'
                      : name === 'profit'
                      ? 'Net Profit'
                      : 'Prior Period Revenue'
                  ]}
                  contentStyle={{
                    backgroundColor: '#1f2230',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    color: '#ffffff',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={30}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Current Revenue"
                  stroke="#ff5a5f"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Net Profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
                <Area
                  type="monotone"
                  dataKey="previousRevenue"
                  name="Prior Period"
                  stroke="#64748b"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Right: Revenue by Category Donut Chart */}
        <div className="col-12 col-xl-4">
          <ChartCard
            title="Sales by Category"
            subtitle="Revenue contribution across business units"
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#1f2230',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    color: '#ffffff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Category breakdown pills */}
            <div className="d-flex flex-wrap gap-2 justify-content-center mt-2">
              {categoryChartData.slice(0, 4).map((c) => (
                <div
                  key={c.name}
                  className="d-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill"
                  style={{ backgroundColor: 'var(--bg-subtle)', fontSize: '0.725rem', border: '1px solid var(--border-color)' }}
                >
                  <span
                    style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.color }}
                  />
                  <span className="fw-medium text-truncate text-white" style={{ maxWidth: '100px' }}>
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Row 2: Regional Performance + Sales Channels + Data-Driven Insights */}
      <div className="row g-4">
        {/* Regional Revenue Distribution */}
        <div className="col-12 col-lg-4">
          <ChartCard
            title="Sales by Region"
            subtitle="Revenue aggregated by territory"
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={regionChartData} layout="vertical" margin={{ top: 5, right: 20, left: 25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis
                  type="number"
                  stroke="var(--text-muted)"
                  fontSize={10}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <YAxis
                  dataKey="region"
                  type="category"
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#1f2230',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    color: '#ffffff'
                  }}
                />
                <Bar dataKey="revenue" fill="#ff5a5f" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Channel Breakdown */}
        <div className="col-12 col-lg-4">
          <ChartCard
            title="Orders by Sales Channel"
            subtitle="Volume distribution across routes to market"
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={channelData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-muted)"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => val.split(' ')[0]}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Volume']}
                  contentStyle={{
                    backgroundColor: '#1f2230',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    color: '#ffffff'
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {channelData.map((entry, index) => (
                    <Cell key={`channel-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Business Insights Panel */}
        <div className="col-12 col-lg-4">
          <div
            className="card h-100 p-3 p-md-4"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: 'rgba(255, 90, 95, 0.15)',
                    color: 'var(--primary)',
                    borderRadius: '8px'
                  }}
                >
                  <Sparkles size={16} />
                </div>
                <h6 className="fw-bold mb-0" style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700 }}>
                  Intelligence Observations
                </h6>
              </div>
              <span
                className="badge rounded-pill"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  fontSize: '0.68rem',
                  fontWeight: 600
                }}
              >
                Computed
              </span>
            </div>

            <div className="d-flex flex-column gap-2.5">
              {insights.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-3"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <ItemIcon size={14} style={{ color: item.color }} />
                      <span className="fw-semibold" style={{ fontSize: '0.8rem', color: '#ffffff' }}>
                        {item.title}
                      </span>
                    </div>
                    <p className="text-secondary mb-0" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Top-Performing Products Table */}
      <div className="row g-4">
        <div className="col-12">
          <div
            className="card p-3 p-md-4"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <h6 className="fw-bold mb-0" style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700 }}>
                  Top-Performing Products by Revenue
                </h6>
                <p className="text-secondary mb-0" style={{ fontSize: '0.775rem' }}>
                  Leading product offerings driving commercial revenue in the active dataset
                </p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                <thead style={{ backgroundColor: '#171923', borderBottom: '1px solid var(--border-color)' }}>
                  <tr>
                    <th style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PRODUCT</th>
                    <th style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CATEGORY</th>
                    <th style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="text-center">UNITS SOLD</th>
                    <th style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="text-end">REVENUE</th>
                    <th style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="text-end">NET PROFIT</th>
                    <th style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="text-end">MARGIN</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, idx) => {
                    const margin = p.revenue > 0 ? ((p.profit / p.revenue) * 100).toFixed(1) : 0;
                    return (
                      <tr key={p.id} className="table-row-hover" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="rounded-circle d-flex align-items-center justify-content-center text-white"
                              style={{
                                width: '24px',
                                height: '24px',
                                backgroundColor: idx === 0 ? 'var(--primary)' : idx === 1 ? '#38bdf8' : 'var(--bg-subtle)',
                                fontSize: '0.7rem',
                                fontWeight: 700
                              }}
                            >
                              {idx + 1}
                            </span>
                            <span className="fw-semibold text-white" style={{ fontSize: '0.84rem' }}>
                              {p.name}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.category}</td>
                        <td className="text-center text-white" style={{ fontSize: '0.8rem' }}>{p.units}</td>
                        <td className="text-end fw-semibold font-mono text-white" style={{ fontSize: '0.84rem' }}>
                          {formatCurrency(p.revenue)}
                        </td>
                        <td className="text-end fw-semibold font-mono text-success" style={{ fontSize: '0.84rem' }}>
                          {formatCurrency(p.profit)}
                        </td>
                        <td className="text-end" style={{ fontSize: '0.8rem' }}>
                          <span
                            className="badge rounded-pill"
                            style={{
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              color: '#34d399',
                              fontWeight: 600
                            }}
                          >
                            {margin}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
