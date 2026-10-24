# InsightIQ — Enterprise Business Analytics Platform

InsightIQ is a high-grade, enterprise SaaS Business Analytics Platform engineered with React, Vite, Bootstrap 5, Recharts, and Lucide React. It enables executives, business owners, sales leaders, and analysts to monitor real-time commercial performance, dissect revenue trends, evaluate margins, analyze multi-touch marketing attribution, and generate board-ready reports.

---

## 🚀 Live Demo & Development Server

The application is fully runnable locally:

```bash
cd "d:\Development\React Dev\insightiq-analytics"
npm install
npm run dev
```

Visit the dashboard in your browser:
**[http://localhost:5174/](http://localhost:5174/)**

To generate a production build:
```bash
npm run build
```

---

## 📊 Key Modules & Features

### 1. Executive Overview (`/`)
- **8 KPI Metric Cards** with SVG sparklines, trend badges, comparison deltas, and calculation tooltips:
  - Total Revenue
  - Total Profit
  - Profit Margin
  - Total Orders
  - Average Order Value (AOV)
  - Active Enterprise Customers
  - Revenue Growth Rate
  - Pipeline Conversion Rate
- **Revenue Trajectory AreaChart**: Multi-period switching (Daily, Weekly, Monthly, Quarterly) with previous-period comparison baseline.
- **Sales by Category Donut**: Revenue contribution across business units.
- **Orders by Sales Channel & Revenue by Region**: Interactive Recharts visualizations.
- **Business Intelligence Insights Panel**: Real-time calculated observations from the active dataset.
- **Top-Performing Products Ledger**: Ranked by revenue, delivered units, and net profit margin.

### 2. Commercial Sales Analytics (`/sales`)
- **KPI Metrics**: Gross sales, net sales, order volume, AOV, sales growth, and refund amount.
- **Gross vs Net Sales Chart**: Tracking discounts and returns against top-line billings.
- **Order Status Distribution**: Pie chart of Completed, Shipped, Processing, and Refunded transactions.
- **Commercial Orders Table**: Multi-column sorting, pagination, search filter, and CSV download.
- **Order Details Modal**: Inspect full commercial line items, unit costs, discounts, and customer logistics.

### 3. Revenue & Profitability (`/revenue`)
- **Income Statement Accounting Engine**:
  - `Net Sales = Gross Sales - Discounts - Refunds`
  - `Gross Profit = Net Sales - COGS`
  - `Operating Expenses (OpEx) = 18% of Net Sales`
  - `Net Profit = Gross Profit - Operating Expenses`
  - `Net Profit Margin = (Net Profit / Net Sales) * 100`
- **Cost Structure Chart**: Comparing Net Revenue against COGS and Operating Expenses monthly.
- **Margin Dynamics (%)**: Historical gross margin vs net profit margin trajectories.
- **Category Profitability Ledger**: Solution vertical reconciliation and profitability tiers.

### 4. Customer Analytics (`/customers`)
- **Customer Metrics**: Total accounts, new signups (<90 days), returning clients, repeat purchase rate, retention rate, and average client spend.
- **Expansion Trajectory**: Cumulative monthly customer growth.
- **Segmentation Chart**: Enterprise, Mid-Market, SMB, and Startup account spend distribution.
- **Client Directory**: Searchable corporate account directory with Profile Details modal.

### 5. Product Analytics & Catalog CRUD (`/products`)
- **Catalog Metrics**: Catalog size, best-seller volume, top revenue SKU, most profitable product, and at-risk product counter.
- **Product Revenue & Profit Bar Chart**: Performance comparison across flagship solutions.
- **Catalog Management Table**: Filter by category, sort by revenue, units sold, or margin.
- **Product CRUD**:
  - **Add Product Modal**: Create new software or service SKUs with custom pricing, COGS, and category.
  - **Edit Product Modal**: Live recalculation of unit margins.
  - **Delete Product with Confirmation**: Safe destructive dialog with undo protections.
  - **View Product Modal**: Direct SKU inspection.
  - All changes automatically persist to `localStorage`.

### 6. Marketing Analytics (`/marketing`)
- **Marketing Metrics**: Total ad spend, impressions, clicks, CTR, conversions, conversion rate, CPA, and ROAS.
- **Campaign Spend vs Attributed Revenue Chart**: Evaluating return on investment per initiative.
- **Marketing Acquisition Funnel**: Impressions $\rightarrow$ Clicks $\rightarrow$ Qualified Enterprise Conversions.
- **Campaign Performance Table**: Complete channel attribution with ROAS badges.

### 7. Regional Performance (`/regional`)
- **Territory Metrics**: Leading territory, opportunity territory, total divisions, and quota attainment.
- **Performance vs Commercial Quota**: Actual Net Revenue compared against Corporate Budget Targets.
- **Regional Performance Table**: Attainment percentage, net revenue, and margin rankings.
- **Regional Drill-Down Modal**: In-depth category breakdown per geographic territory.

### 8. Intelligence Reports & Audit Center (`/reports`)
- **7 Pre-Built Audit Templates**:
  1. Executive Summary Brief
  2. Commercial Sales Performance Report
  3. Income & Margin Statement
  4. Customer Portfolio Analysis
  5. Product Catalog Velocity
  6. Marketing ROI & Attribution
  7. Regional Territory Assessment
- **Features**: Live ledger preview, custom date range filtering, browser print/PDF export (`window.print()`), and CSV export.

### 9. Platform Settings (`/settings`)
- **Theme Switcher**: Executive Light mode and Sleek Dark mode with instantaneous design token updates.
- **Display Density**: Select between `compact`, `standard`, and `spacious` table row heights.
- **Currency Preferences**: USD, EUR, GBP, CAD.
- **Demo Sandbox Controls**:
  - Export full sandbox backup as JSON.
  - Restore factory demo data with confirmation modal.

---

## 🛠️ Architecture & Design System

```
insightiq-analytics/
├── index.html                     # HTML5 Shell with Bootstrap 5 & Google Fonts
├── vite.config.js                 # Vite bundler configuration (port 5174)
├── package.json                   # Dependencies (React, Recharts, Lucide, date-fns)
├── src/
│   ├── main.jsx                   # Application entrypoint
│   ├── App.jsx                    # Routing configuration with React Router DOM
│   ├── index.css                  # Custom CSS design system, themes & animations
│   ├── context/
│   │   └── AnalyticsContext.jsx   # Global business intelligence state & calculations
│   ├── utils/
│   │   ├── currencyFormatter.js   # Currency, number & percent formatters
│   │   ├── calculations.js        # Core BI formulas, margins & delta calculations
│   │   ├── dateUtils.js           # Date range presets & filter logic
│   │   └── csvExport.js           # Client-side RFC 4180 CSV export utility
│   ├── data/
│   │   ├── orders.js              # 360 coherent sales orders across 12 months
│   │   ├── products.js            # 20 enterprise software & hardware SKUs
│   │   ├── customers.js           # 20 corporate client accounts
│   │   ├── categories.js          # 8 business solution categories
│   │   ├── regions.js             # 5 global territories with revenue targets
│   │   └── campaigns.js           # 8 multi-channel marketing campaigns
│   ├── components/
│   │   ├── Sidebar.jsx            # Collapsible navigation, mobile offcanvas drawer
│   │   ├── Header.jsx             # Breadcrumbs, title, search, export & theme toggle
│   │   ├── KPICard.jsx            # KPI metric card with SVG sparkline & trend badge
│   │   ├── ChartCard.jsx          # Recharts container wrapper with action buttons
│   │   ├── GlobalFilters.jsx      # Multi-dimensional filter bar with active chips
│   │   ├── DataTable.jsx          # Sortable, searchable, paginated table with CSV
│   │   ├── StatusBadge.jsx        # Standardized status badges
│   │   ├── Modal.jsx              # Accessible modal dialog
│   │   ├── ConfirmDialog.jsx      # Safe destructive action confirmation
│   │   ├── Toast.jsx              # Floating toast notification system
│   │   └── EmptyState.jsx         # Clean empty state with recovery CTA
│   ├── layouts/
│   │   └── DashboardLayout.jsx    # Persistent dashboard shell with sidebar & header
│   └── pages/
│       ├── Dashboard.jsx          # Executive Overview
│       ├── SalesAnalytics.jsx     # Commercial Sales Analytics
│       ├── RevenueProfit.jsx      # Revenue & Profitability Statement
│       ├── CustomerAnalytics.jsx  # Customer Analytics
│       ├── ProductAnalytics.jsx   # Product Analytics & Catalog CRUD
│       ├── MarketingAnalytics.jsx # Marketing Performance & Funnel
│       ├── RegionalAnalytics.jsx  # Regional Quota & Performance
│       ├── Reports.jsx            # Reports & Data Export Center
│       └── Settings.jsx           # Theme, Density & Sandbox Settings
```

---

## 🔒 Restrictions & Compliance
- **Strictly Frontend-Only**: No external server, remote database, or third-party paid tracking APIs required.
- **Data Reconciliation**: Every KPI, chart, and ledger reconciles with the underlying mock dataset without hardcoded numbers.
- **Persistence**: Supported preferences and catalog changes are cached in browser `localStorage`.
