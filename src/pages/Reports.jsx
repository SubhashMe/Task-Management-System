import React, { useState, useMemo } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { KPICard } from '../components/KPICard';
import { DataTable } from '../components/DataTable';
import { formatCurrency, formatNumber, formatPercent } from '../utils/currencyFormatter';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Filter,
  CheckCircle,
  Building,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Megaphone,
  Globe
} from 'lucide-react';

export const Reports = () => {
  const {
    filteredOrders,
    currentMetrics,
    customerMetrics,
    marketingMetrics,
    products,
    customers,
    regions,
    categories,
    dateRange,
    exportToCSV,
    showToast
  } = useAnalytics();

  const [selectedReportType, setSelectedReportType] = useState('executive');

  const reportDefinitions = [
    { id: 'executive', name: 'Executive Summary Brief', icon: TrendingUp, desc: 'High-level commercial KPIs, revenue trajectory, and profitability margin' },
    { id: 'sales', name: 'Commercial Sales Performance', icon: DollarSign, desc: 'Detailed orders, channels, gross sales, discounts, and net realized volume' },
    { id: 'revenue', name: 'Income & Margin Statement', icon: FileText, desc: 'Financial breakdown of Net Sales, COGS, Gross Profit, and Operating Margins' },
    { id: 'customers', name: 'Customer Portfolio Analysis', icon: Users, desc: 'Account lifetime values, repeat order rates, retention cohorts, and tiers' },
    { id: 'products', name: 'Product Catalog Velocity', icon: Package, desc: 'SKU performance, units delivered, gross margins, and inventory health' },
    { id: 'marketing', name: 'Marketing ROI & Attribution', icon: Megaphone, desc: 'Campaign ad spend, CTR, conversion rates, CPA, and return on ad spend' },
    { id: 'regional', name: 'Regional Territory Assessment', icon: Globe, desc: 'Territory quota attainment, revenue distribution, and regional profits' }
  ];

  // Active Report Data Configuration
  const reportData = useMemo(() => {
    switch (selectedReportType) {
      case 'sales':
        return {
          title: 'Commercial Sales Performance Report',
          filename: `sales-report-${dateRange}.csv`,
          data: filteredOrders,
          columns: [
            { key: 'id', title: 'Order ID' },
            { key: 'orderDate', title: 'Date' },
            { key: 'productName', title: 'Product' },
            { key: 'customerName', title: 'Customer' },
            { key: 'salesChannel', title: 'Channel' },
            { key: 'quantity', title: 'Qty', align: 'center' },
            { key: 'grossAmount', title: 'Gross ($)', align: 'right', render: (v) => formatCurrency(v) },
            { key: 'discountAmount', title: 'Discount ($)', align: 'right', render: (v) => `-${formatCurrency(v)}` },
            { key: 'netSales', title: 'Net Sales ($)', align: 'right', render: (v) => formatCurrency(v) },
            { key: 'netProfit', title: 'Net Profit ($)', align: 'right', render: (v) => formatCurrency(v) }
          ]
        };
      case 'revenue':
        return {
          title: 'Financial Revenue & Profitability Statement',
          filename: `financial-statement-${dateRange}.csv`,
          data: categories.map((cat) => {
            const catOrders = filteredOrders.filter((o) => o.category === cat.name);
            const netSales = catOrders.reduce((sum, o) => sum + o.netSales, 0);
            const cogs = catOrders.reduce((sum, o) => sum + o.costOfGoodsSold, 0);
            const grossProfit = catOrders.reduce((sum, o) => sum + o.grossProfit, 0);
            const netProfit = catOrders.reduce((sum, o) => sum + o.netProfit, 0);
            const margin = netSales > 0 ? ((netProfit / netSales) * 100).toFixed(1) : 0;
            return {
              category: cat.name,
              ordersCount: catOrders.length,
              netSales,
              cogs,
              grossProfit,
              netProfit,
              margin
            };
          }),
          columns: [
            { key: 'category', title: 'Solution Vertical' },
            { key: 'ordersCount', title: 'Orders', align: 'center' },
            { key: 'netSales', title: 'Net Sales', align: 'right', render: (v) => formatCurrency(v) },
            { key: 'cogs', title: 'COGS', align: 'right', render: (v) => formatCurrency(v) },
            { key: 'grossProfit', title: 'Gross Profit', align: 'right', render: (v) => formatCurrency(v) },
            { key: 'netProfit', title: 'Net Profit', align: 'right', render: (v) => formatCurrency(v) },
            { key: 'margin', title: 'Margin %', align: 'right', render: (v) => `${v}%` }
          ]
        };
      case 'customers':
        return {
          title: 'Enterprise Customer Portfolio Audit',
          filename: `customer-audit-${dateRange}.csv`,
          data: customers,
          columns: [
            { key: 'id', title: 'Customer ID' },
            { key: 'name', title: 'Account Name' },
            { key: 'segment', title: 'Segment' },
            { key: 'region', title: 'Territory' },
            { key: 'ordersCount', title: 'Orders', align: 'center' },
            { key: 'totalSpend', title: 'Total Spend', align: 'right', render: (v) => formatCurrency(v) },
            { key: 'lastPurchaseDate', title: 'Last Active' }
          ]
        };
      case 'products':
        return {
          title: 'Product Catalog & Inventory Performance',
          filename: `product-catalog-${dateRange}.csv`,
          data: products,
          columns: [
            { key: 'id', title: 'SKU ID' },
            { key: 'name', title: 'Product Name' },
            { key: 'category', title: 'Category' },
            { key: 'unitPrice', title: 'Price', align: 'right', render: (v) => formatCurrency(v) },
            { key: 'unitCost', title: 'Cost', align: 'right', render: (v) => formatCurrency(v) },
            { key: 'marginPercent', title: 'Margin %', align: 'right', render: (v) => `${v}%` },
            { key: 'status', title: 'Status', align: 'center' }
          ]
        };
      case 'regional':
        return {
          title: 'Regional Territory Assessment Report',
          filename: `regional-assessment-${dateRange}.csv`,
          data: regions.map((r) => {
            const regOrders = filteredOrders.filter((o) => o.region === r.name);
            const revenue = regOrders.reduce((sum, o) => sum + o.netSales, 0);
            const profit = regOrders.reduce((sum, o) => sum + o.netProfit, 0);
            const attainment = r.revenueTarget > 0 ? ((revenue / r.revenueTarget) * 100).toFixed(1) : 0;
            return {
              name: r.name,
              code: r.code,
              target: r.revenueTarget,
              revenue,
              profit,
              attainment
            };
          }),
          columns: [
            { key: 'name', title: 'Region' },
            { key: 'code', title: 'Code', align: 'center' },
            { key: 'target', title: 'Quota Target', align: 'right', render: (v) => formatCurrency(v) },
            { key: 'revenue', title: 'Realized Revenue', align: 'right', render: (v) => formatCurrency(v) },
            { key: 'profit', title: 'Net Profit', align: 'right', render: (v) => formatCurrency(v) },
            { key: 'attainment', title: 'Quota %', align: 'right', render: (v) => `${v}%` }
          ]
        };
      case 'executive':
      default:
        return {
          title: 'Executive Intelligence Summary Brief',
          filename: `executive-brief-${dateRange}.csv`,
          data: [
            { metric: 'Total Gross Sales', value: formatCurrency(currentMetrics.grossSales), context: 'Before discounts & credits' },
            { metric: 'Total Net Sales', value: formatCurrency(currentMetrics.netSales), context: 'After discounts and returns' },
            { metric: 'Gross Profit', value: formatCurrency(currentMetrics.grossProfit), context: 'Net Sales - Direct COGS' },
            { metric: 'Total Net Profit', value: formatCurrency(currentMetrics.netProfit), context: 'Net Sales - COGS - OpEx' },
            { metric: 'Net Margin', value: formatPercent(currentMetrics.netMargin), context: 'Healthy corporate benchmark' },
            { metric: 'Total Commercial Orders', value: formatNumber(currentMetrics.totalOrders), context: 'Processed order volume' },
            { metric: 'Average Order Value (AOV)', value: formatCurrency(currentMetrics.aov), context: 'Mean ticket value' },
            { metric: 'Client Base Size', value: formatNumber(customers.length), context: 'Corporate accounts' }
          ],
          columns: [
            { key: 'metric', title: 'Key Performance Metric' },
            { key: 'value', title: 'Reported Value', align: 'right' },
            { key: 'context', title: 'Accounting Definition' }
          ]
        };
    }
  }, [selectedReportType, filteredOrders, currentMetrics, categories, customers, products, regions, dateRange]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!reportData.data || reportData.data.length === 0) {
      showToast('No data available to export in current report', 'warning');
      return;
    }
    exportToCSV(reportData.data, reportData.filename);
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Report Selector Header */}
      <div
        className="card p-3 p-md-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <div>
            <h5 className="fw-bold mb-1" style={{ color: '#ffffff' }}>
              Intelligence Reports &amp; Audit Center
            </h5>
            <p className="text-secondary mb-0" style={{ fontSize: '0.8rem' }}>
              Select a specialized business reporting template, review generated data, and export or print.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-sm d-flex align-items-center gap-1.5"
              style={{
                fontSize: '0.825rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                padding: '6px 14px'
              }}
              title="Print formatted executive document"
            >
              <Printer size={15} />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="btn btn-sm btn-primary d-flex align-items-center gap-1.5 text-white"
              style={{
                backgroundColor: 'var(--primary)',
                border: 'none',
                fontSize: '0.825rem',
                borderRadius: 'var(--radius-full)',
                padding: '6px 16px',
                boxShadow: '0 4px 14px rgba(255, 90, 95, 0.35)'
              }}
              title="Export report dataset to CSV"
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Template Selector Pills */}
        <div className="d-flex flex-wrap gap-2 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
          {reportDefinitions.map((rep) => {
            const isSelected = selectedReportType === rep.id;
            const RepIcon = rep.icon;
            return (
              <button
                key={rep.id}
                type="button"
                onClick={() => setSelectedReportType(rep.id)}
                className={`btn btn-sm d-flex align-items-center gap-2 text-start px-3 py-2 ${
                  isSelected ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 600 : 500,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-subtle)',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: isSelected ? '0 2px 10px rgba(255, 90, 95, 0.35)' : 'none'
                }}
              >
                <RepIcon size={14} />
                <span>{rep.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div
        className="card p-4 p-md-5 print-container"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
        }}
      >
        {/* Document Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 pb-4 mb-4 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold h4 mb-0" style={{ color: 'var(--brand-primary)' }}>InsightIQ</span>
              <span className="badge" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>Enterprise</span>
            </div>
            <h5 className="fw-bold mt-2 mb-1" style={{ color: 'var(--text-primary)' }}>
              {reportData.title}
            </h5>
            <div className="text-muted" style={{ fontSize: '0.8rem' }}>
              Reporting Window: <strong>{dateRange} Preset</strong> • Organization: <strong>Acme Global Inc.</strong>
            </div>
          </div>

          <div className="text-end text-muted" style={{ fontSize: '0.78rem' }}>
            <div>Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
            <div>Auditor: Jane Doe (Chief Analytics Officer)</div>
            <div>Classification: <strong>Confidential Internal</strong></div>
          </div>
        </div>

        {/* Executive Highlights Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
              <span className="text-muted" style={{ fontSize: '0.725rem' }}>TOTAL REPORTED SALES</span>
              <div className="fw-bold font-mono mt-1" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                {formatCurrency(currentMetrics.netSales)}
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
              <span className="text-muted" style={{ fontSize: '0.725rem' }}>TOTAL PROFIT</span>
              <div className="fw-bold font-mono text-success mt-1" style={{ fontSize: '1.25rem' }}>
                {formatCurrency(currentMetrics.netProfit)}
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
              <span className="text-muted" style={{ fontSize: '0.725rem' }}>PROFIT MARGIN</span>
              <div className="fw-bold font-mono mt-1" style={{ fontSize: '1.25rem', color: '#10b981' }}>
                {formatPercent(currentMetrics.netMargin)}
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-3 rounded-2" style={{ backgroundColor: 'var(--bg-subtle)' }}>
              <span className="text-muted" style={{ fontSize: '0.725rem' }}>TOTAL TRANSACTIONS</span>
              <div className="fw-bold font-mono mt-1" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                {formatNumber(currentMetrics.totalOrders)}
              </div>
            </div>
          </div>
        </div>

        {/* Live Data Preview Table */}
        <DataTable
          title="Audit Ledger & Record Preview"
          columns={reportData.columns}
          data={reportData.data}
          exportFilename={reportData.filename}
          searchPlaceholder="Search within this report..."
        />

        {/* Document Sign-off Footer */}
        <div className="mt-5 pt-4 border-top d-flex flex-wrap justify-content-between text-muted" style={{ borderColor: 'var(--border-subtle)', fontSize: '0.75rem' }}>
          <div>InsightIQ Business Analytics Platform v2.4 • Client-Side Verified Model</div>
          <div>Page 1 of 1 • System Export Ready</div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
