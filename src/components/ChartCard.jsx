import React from 'react';

export const ChartCard = ({
  title,
  subtitle,
  children,
  action,
  headerRight,
  minHeight = '320px',
  footer
}) => {
  return (
    <div
      className="card h-100 p-3 p-md-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <h6
            className="fw-bold mb-0"
            style={{
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            {title}
          </h6>
          {subtitle && (
            <p
              className="text-muted mb-0"
              style={{
                fontSize: '0.8rem',
                fontWeight: 500,
                marginTop: '3px',
                lineHeight: 1.3
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {headerRight && (
          <div className="d-flex align-items-center gap-2">
            {headerRight}
          </div>
        )}

        {action && !headerRight && (
          <div>{action}</div>
        )}
      </div>

      {/* Chart Canvas Area */}
      <div
        className="w-100 position-relative"
        style={{
          flex: 1,
          minHeight: minHeight
        }}
      >
        {children}
      </div>

      {/* Optional Card Footer */}
      {footer && (
        <div
          className="mt-3 pt-2.5 border-top d-flex align-items-center justify-content-between"
          style={{ borderColor: 'var(--border-color)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default ChartCard;
