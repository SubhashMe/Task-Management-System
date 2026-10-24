import React, { useMemo } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { KPICard } from '../components/KPICard';
import { ChartCard } from '../components/ChartCard';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency, formatNumber, formatPercent } from '../utils/currencyFormatter';
import {
  Megaphone,
  MousePointer,
  Eye,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  Award,
  Target,
  ArrowRight
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

export const MarketingAnalytics = () => {
  const { campaigns, marketingMetrics } = useAnalytics();

  // 1. Spend vs Attributed Revenue by Campaign
  const spendVsRevenueData = useMemo(() => {
    return campaigns.map((c) => ({
      name: c.name.length > 18 ? c.name.slice(0, 16) + '...' : c.name,
      spend: c.spend,
      revenue: c.attributedRevenue,
      roas: c.roas
    }));
  }, [campaigns]);

  // 2. Channel Performance aggregation
  const channelData = useMemo(() => {
    const map = {};
    campaigns.forEach((c) => {
      if (!map[c.channel]) {
        map[c.channel] = { channel: c.channel, spend: 0, revenue: 0, conversions: 0 };
      }
      map[c.channel].spend += c.spend;
      map[c.channel].revenue += c.attributedRevenue;
      map[c.channel].conversions += c.conversions;
    });

    return Object.values(map).map((row) => ({
      ...row,
      roas: row.spend > 0 ? Number((row.revenue / row.spend).toFixed(2)) : 0
    }));
  }, [campaigns]);

  // Table Columns
  const columns = [
    {
      key: 'name',
      title: 'Campaign Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
            {val}
          </div>
          <div className="text-muted" style={{ fontSize: '0.725rem' }}>
            ID: {row.id} • {row.channel}
          </div>
        </div>
      )
    },
    {
      key: 'channel',
      title: 'Channel',
      sortable: true,
      render: (val) => <span style={{ fontSize: '0.8rem' }}>{val}</span>
    },
    {
      key: 'spend',
      title: 'Spend',
      align: 'right',
      sortable: true,
      render: (val) => <span className="font-mono fw-semibold">{formatCurrency(val)}</span>
    },
    {
      key: 'impressions',
      title: 'Impressions',
      align: 'right',
      sortable: true,
      render: (val) => <span className="font-mono text-muted">{formatNumber(val)}</span>
    },
    {
      key: 'clicks',
      title: 'Clicks',
      align: 'right',
      sortable: true,
      render: (val) => <span className="font-mono">{formatNumber(val)}</span>
    },
    {
      key: 'ctr',
      title: 'CTR',
      align: 'right',
      sortable: true,
      render: (val) => <span className="font-mono">{formatPercent(val)}</span>
    },
    {
      key: 'conversions',
      title: 'Conv.',
      align: 'center',
      sortable: true,
      render: (val) => <span className="font-mono fw-bold">{val}</span>
    },
    {
      key: 'attributedRevenue',
      title: 'Attributed Rev.',
      align: 'right',
      sortable: true,
      render: (val) => (
        <span className="font-mono fw-bold" style={{ color: 'var(--text-primary)' }}>
          {formatCurrency(val)}
        </span>
      )
    },
    {
      key: 'cpa',
      title: 'CPA',
      align: 'right',
      sortable: true,
      render: (val) => <span className="font-mono text-muted">{formatCurrency(val)}</span>
    },
    {
      key: 'roas',
      title: 'ROAS',
      align: 'right',
      sortable: true,
      render: (val) => (
        <span
          className="badge"
          style={{
            backgroundColor: val >= 4 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(79, 70, 229, 0.1)',
            color: val >= 4 ? '#10b981' : '#4f46e5',
            fontWeight: 700
          }}
        >
          {val}x
        </span>
      )
    }
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* 8 Marketing KPIs */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Total Ad Spend"
            value={formatCurrency(marketingMetrics.totalSpend)}
            delta={{ percentChange: '+8.4%', trendType: 'neutral' }}
            comparisonLabel="budget utilized"
            tooltip="Total marketing capital invested across all running campaigns."
            icon={Megaphone}
            sparklineData={[12000, 14000, 15000, 16000, 17500, 18000, 19000, 20000]}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Attributed Revenue"
            value={formatCurrency(marketingMetrics.totalAttributedRevenue)}
            delta={{ percentChange: '+18.6%', trendType: 'positive' }}
            comparisonLabel="multi-touch pipeline"
            tooltip="Closed revenue credited to direct campaign acquisition sources."
            icon={DollarSign}
            sparklineData={[45000, 52000, 60000, 68000, 75000, 84000, 92000, 105000]}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Return on Ad Spend (ROAS)"
            value={`${marketingMetrics.roas}x`}
            delta={{ percentChange: '+0.4x', trendType: 'positive' }}
            comparisonLabel="target 4.0x"
            tooltip="Attributed revenue divided by total marketing expenditure."
            icon={TrendingUp}
            sparklineData={[4.2, 4.4, 4.5, 4.8, 5.0, 5.1, 5.2, 5.3]}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Cost Per Acq. (CPA)"
            value={formatCurrency(marketingMetrics.cpa)}
            delta={{ percentChange: '-6.2%', trendType: 'positive' }}
            comparisonLabel="improving efficiency"
            tooltip="Total marketing spend divided by total commercial conversions."
            icon={Target}
            invertTrendColor={true}
            sparklineData={[280, 270, 260, 255, 245, 240, 230, 224]}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Total Impressions"
            value={formatNumber(marketingMetrics.totalImpressions)}
            delta={{ percentChange: '+14.2%', trendType: 'positive' }}
            comparisonLabel="brand reach"
            tooltip="Total impressions across search, social, newsletters and programmatic ads."
            icon={Eye}
            sparklineData={[80, 90, 105, 110, 125, 135, 142, 155]}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Total Clicks"
            value={formatNumber(marketingMetrics.totalClicks)}
            delta={{ percentChange: '+11.5%', trendType: 'positive' }}
            comparisonLabel="inbound traffic"
            tooltip="Direct verified clicks directed to landing pages and product trials."
            icon={MousePointer}
            sparklineData={[2400, 2600, 2900, 3100, 3300, 3600, 3800, 4100]}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Click-Through Rate (CTR)"
            value={formatPercent(marketingMetrics.ctr)}
            delta={{ percentChange: '+0.2%', trendType: 'positive' }}
            comparisonLabel="benchmark 2.2%"
            tooltip="Percentage of impression impressions that resulted in clicks."
            icon={Percent}
            sparklineData={[2.4, 2.5, 2.5, 2.6, 2.7, 2.7, 2.8, 2.8]}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard
            title="Total Conversions"
            value={formatNumber(marketingMetrics.totalConversions)}
            delta={{ percentChange: '+15.8%', trendType: 'positive' }}
            comparisonLabel="enterprise signups"
            tooltip="Completed lead actions, demo requests, and corporate contract starts."
            icon={CheckCircle}
            sparklineData={[80, 95, 110, 125, 140, 155, 170, 188]}
          />
        </div>
      </div>

      {/* Row 2: Spend vs Attributed Revenue Chart & Conversion Funnel */}
      <div className="row g-4">
        {/* Spend vs Attributed Revenue */}
        <div className="col-12 col-xl-7">
          <ChartCard
            title="Campaign Spend vs Attributed Revenue"
            subtitle="Evaluating return on marketing investment per initiative"
          >
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={spendVsRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                    name === 'spend' ? 'Campaign Spend' : 'Attributed Revenue'
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
                <Bar dataKey="spend" name="Campaign Spend" fill="rgba(255, 255, 255, 0.2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" name="Attributed Revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Marketing Conversion Funnel */}
        <div className="col-12 col-xl-5">
          <div
            className="card h-100 p-3 p-md-4"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
            }}
          >
            <h6 className="fw-bold mb-1" style={{ color: '#ffffff', fontSize: '0.95rem' }}>
              Marketing Acquisition Funnel
            </h6>
            <p className="text-secondary mb-3" style={{ fontSize: '0.775rem' }}>
              Conversion velocity from broad impressions to closed customers
            </p>

            <div className="d-flex flex-column gap-3 my-auto">
              {/* Step 1: Impressions */}
              <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold" style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                    1. Ad Impressions
                  </span>
                  <span className="fw-bold font-mono" style={{ fontSize: '0.9rem' }}>
                    {formatNumber(marketingMetrics.totalImpressions)}
                  </span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div className="progress-bar" style={{ width: '100%', backgroundColor: '#94a3b8' }} />
                </div>
              </div>

              {/* Step 2: Clicks */}
              <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold" style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                    2. Inbound Clicks (CTR {formatPercent(marketingMetrics.ctr)})
                  </span>
                  <span className="fw-bold font-mono" style={{ fontSize: '0.9rem' }}>
                    {formatNumber(marketingMetrics.totalClicks)}
                  </span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div className="progress-bar" style={{ width: '45%', backgroundColor: '#06b6d4' }} />
                </div>
              </div>

              {/* Step 3: Conversions */}
              <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold" style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                    3. Trial & Demo Conversions (Conv. Rate {formatPercent(marketingMetrics.conversionRate)})
                  </span>
                  <span className="fw-bold font-mono" style={{ fontSize: '0.9rem' }}>
                    {formatNumber(marketingMetrics.totalConversions)}
                  </span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div className="progress-bar" style={{ width: '22%', backgroundColor: '#10b981' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Performance Table */}
      <DataTable
        title="Marketing Campaigns Portfolio"
        columns={columns}
        data={campaigns}
        defaultSortKey="roas"
        defaultSortDirection="desc"
        exportFilename="marketing-campaigns.csv"
        searchPlaceholder="Filter campaigns by name or channel..."
      />
    </div>
  );
};

export default MarketingAnalytics;
