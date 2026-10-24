import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useAnalytics();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: 'calc(100% - 48px)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((t) => {
        let icon = <CheckCircle2 size={18} color="#10b981" />;
        let borderLeft = '4px solid #10b981';

        if (t.type === 'error') {
          icon = <XCircle size={18} color="#ef4444" />;
          borderLeft = '4px solid #ef4444';
        } else if (t.type === 'warning') {
          icon = <AlertTriangle size={18} color="#f59e0b" />;
          borderLeft = '4px solid #f59e0b';
        } else if (t.type === 'info') {
          icon = <Info size={18} color="#3b82f6" />;
          borderLeft = '4px solid #3b82f6';
        }

        return (
          <div
            key={t.id}
            className="shadow-lg rounded-3 d-flex align-items-center justify-content-between p-3 animate-fade-in"
            style={{
              pointerEvents: 'auto',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderLeft: borderLeft,
              fontSize: '0.875rem',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div className="d-flex align-items-center gap-2.5">
              <span className="flex-shrink-0">{icon}</span>
              <span style={{ fontWeight: 500, lineHeight: 1.4 }}>{t.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="btn btn-sm btn-link p-1 text-muted flex-shrink-0 ms-2"
              aria-label="Close notification"
              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
