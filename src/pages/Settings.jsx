import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../context/AnalyticsContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  Settings as SettingsIcon,
  Moon,
  Sparkles,
  RotateCcw,
  Shield,
  Building,
  Database,
  Sliders,
  DollarSign,
  Download,
  CheckCircle2,
  Lock,
  LogOut
} from 'lucide-react';

export const Settings = () => {
  const navigate = useNavigate();
  const {
    tableDensity,
    setTableDensity,
    currency,
    setCurrency,
    resetToDefaults,
    orders,
    products,
    customers,
    showToast,
    currentUser,
    logout
  } = useAnalytics();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleBackupExport = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      orders,
      products,
      customers
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `insightiq-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Sandbox backup exported successfully', 'success');
  };

  return (
    <div className="d-flex flex-column gap-4" style={{ maxWidth: '960px' }}>
      {/* Page Description */}
      <div>
        <h5 className="fw-bold mb-1" style={{ color: '#ffffff' }}>
          Platform Settings &amp; Environment
        </h5>
        <p className="text-secondary mb-0" style={{ fontSize: '0.825rem' }}>
          Configure enterprise appearance, data table display density, and manage client-side mock datasets.
        </p>
      </div>

      {/* 1. Appearance & Corporate Identity */}
      <div
        className="card p-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div className="d-flex align-items-center gap-2 mb-3">
          <Moon size={18} color="var(--primary)" />
          <h6 className="fw-bold mb-0" style={{ color: '#ffffff' }}>
            Appearance &amp; Visual Identity
          </h6>
        </div>

        <div className="p-3 rounded-3" style={{ backgroundColor: '#171924', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="d-flex align-items-center justify-content-between mb-1">
            <div className="d-flex align-items-center gap-2">
              <Sparkles size={16} color="var(--primary)" />
              <span className="fw-semibold" style={{ fontSize: '0.88rem', color: '#ffffff' }}>
                Aurora Obsidian Dark (Dedicated Global System)
              </span>
            </div>
            <span
              className="badge rounded-pill"
              style={{
                backgroundColor: 'rgba(255, 90, 95, 0.15)',
                color: '#ff7e82',
                border: '1px solid rgba(255, 90, 95, 0.3)',
                fontSize: '0.72rem'
              }}
            >
              Active &amp; Dedicated
            </span>
          </div>
          <p className="text-secondary mb-0" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
            Permanent sleek dark theme inspired by Aurora space intelligence: deep obsidian cards, vibrant coral accents, neon emerald highlights, and high-contrast typography. All legacy themes have been retired.
          </p>
        </div>
      </div>

      {/* 2. Table Density & Interface Preferences */}
      <div
        className="card p-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div className="d-flex align-items-center gap-2 mb-3">
          <Sliders size={18} color="var(--primary)" />
          <h6 className="fw-bold mb-0" style={{ color: '#ffffff' }}>
            Data Display &amp; Density
          </h6>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label text-secondary" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              TABLE PADDING DENSITY
            </label>
            <div className="btn-group w-100 p-1 rounded-pill" style={{ backgroundColor: '#171924', border: '1px solid var(--border-color)' }}>
              {['compact', 'standard', 'spacious'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setTableDensity(d)}
                  className="btn btn-sm text-capitalize"
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: tableDensity === d ? 'var(--primary)' : 'transparent',
                    border: 'none',
                    color: tableDensity === d ? '#ffffff' : 'var(--text-secondary)',
                    boxShadow: tableDensity === d ? '0 2px 8px rgba(255, 90, 95, 0.4)' : 'none'
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="text-muted mt-1.5" style={{ fontSize: '0.725rem' }}>
              Controls the vertical row height across all data tables.
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label text-secondary" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              BASE CURRENCY
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="form-select form-select-sm"
              style={{
                backgroundColor: '#171924',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '0.825rem',
                borderRadius: '10px'
              }}
            >
              <option value="USD">USD ($) — United States Dollar</option>
              <option value="EUR">EUR (€) — Euro Area</option>
              <option value="GBP">GBP (£) — British Pound</option>
              <option value="CAD">CAD ($) — Canadian Dollar</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Organization & Workspace Info */}
      <div
        className="card p-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div className="d-flex align-items-center gap-2 mb-3">
          <Building size={18} color="var(--primary)" />
          <h6 className="fw-bold mb-0" style={{ color: '#ffffff' }}>
            Organization &amp; Security
          </h6>
        </div>

        <div className="row g-3" style={{ fontSize: '0.825rem' }}>
          <div className="col-12 col-sm-6">
            <div className="text-secondary" style={{ fontSize: '0.74rem' }}>ORGANIZATION</div>
            <div className="fw-semibold text-white mt-0.5">Acme Global Technologies Inc.</div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="text-secondary" style={{ fontSize: '0.74rem' }}>WORKSPACE TIER</div>
            <div className="fw-semibold text-coral mt-0.5">Enterprise Cloud Analytics (PRO)</div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="text-secondary" style={{ fontSize: '0.74rem' }}>DATA ISOLATION</div>
            <div className="fw-semibold text-mint d-flex align-items-center gap-1 mt-0.5">
              <Lock size={13} /> Strict Client-Side Sandbox (Zero External Telemetry)
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="text-secondary" style={{ fontSize: '0.74rem' }}>CACHE STATUS</div>
            <div className="fw-semibold font-mono text-white mt-0.5">
              {orders.length} Orders • {products.length} Products • {customers.length} Customers
            </div>
          </div>
        </div>
      </div>

      {/* 4. Mock Data Sandbox Management */}
      <div
        className="card p-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div className="d-flex align-items-center gap-2 mb-3">
          <Database size={18} color="#ef4444" />
          <h6 className="fw-bold mb-0" style={{ color: '#ffffff' }}>
            Demo Dataset Management
          </h6>
        </div>

        <p className="text-secondary" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
          All modified products and filtered records are stored in browser LocalStorage. You can export a JSON backup of your customized dataset or restore the pristine factory defaults anytime.
        </p>

        <div className="d-flex flex-wrap align-items-center gap-3 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
          <button
            type="button"
            onClick={handleBackupExport}
            className="btn btn-sm d-flex align-items-center gap-2"
            style={{
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              color: '#ffffff',
              padding: '6px 14px'
            }}
          >
            <Download size={14} />
            <span>Export Sandbox Backup JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="btn btn-sm d-flex align-items-center gap-2"
            style={{
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '6px 14px'
            }}
          >
            <RotateCcw size={14} />
            <span>Restore Factory Demo Data</span>
          </button>
        </div>
      </div>

      {/* 5. Active Session & Operator Access */}
      <div
        className="card p-4 mb-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <Shield size={18} color="var(--primary)" />
              <h6 className="fw-bold mb-0" style={{ color: '#ffffff' }}>
                Active Operator Session
              </h6>
              <span
                className="badge rounded-pill"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.14)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.28)',
                  fontSize: '0.7rem'
                }}
              >
                TLS Authenticated
              </span>
            </div>
            <div className="text-secondary" style={{ fontSize: '0.8rem' }}>
              Logged in as <strong className="text-white">{currentUser?.name || 'Jane Doe'}</strong> ({currentUser?.email || 'admin@insightiq.io'}) • Operator ID: <code className="text-coral">{currentUser?.username || 'Admin'}</code>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="btn btn-sm d-flex align-items-center gap-1.5 px-3 py-2"
            style={{
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontWeight: 600
            }}
          >
            <LogOut size={14} />
            <span>Sign Out of Analytics</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={resetToDefaults}
        title="Reset Entire Demo Sandbox?"
        description="This will erase all added or modified products from LocalStorage and reload the pristine enterprise dataset. This action cannot be reversed."
        confirmText="Yes, Reset to Defaults"
        type="danger"
      />
    </div>
  );
};

export default Settings;
