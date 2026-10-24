import React from 'react';
import { FilterX, RotateCcw, Search } from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const EmptyState = ({
  icon: Icon = FilterX,
  title = 'No results found',
  description = 'Try adjusting your filters, date range, or search criteria to find what you are looking for.',
  actionLabel = 'Reset All Filters',
  onAction,
  showAction = true
}) => {
  const { resetAllFilters } = useAnalytics();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      resetAllFilters();
    }
  };

  return (
    <div
      className="text-center py-5 px-4 rounded-3 border border-dashed my-3"
      style={{
        borderColor: 'var(--border-subtle)',
        backgroundColor: 'var(--bg-card)',
        padding: '3rem 1.5rem'
      }}
    >
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
        style={{
          width: '64px',
          height: '64px',
          backgroundColor: 'var(--bg-subtle)',
          color: 'var(--text-secondary)'
        }}
      >
        <Icon size={30} strokeWidth={1.75} />
      </div>

      <h5
        className="fw-bold mb-2"
        style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}
      >
        {title}
      </h5>

      <p
        className="text-muted mx-auto mb-4"
        style={{ maxWidth: '420px', fontSize: '0.875rem', lineHeight: '1.5' }}
      >
        {description}
      </p>

      {showAction && (
        <button
          type="button"
          onClick={handleAction}
          className="btn btn-primary d-inline-flex align-items-center gap-2 px-3 py-2"
          style={{
            backgroundColor: 'var(--brand-primary)',
            borderColor: 'var(--brand-primary)',
            fontSize: '0.85rem',
            fontWeight: 500,
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <RotateCcw size={15} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
