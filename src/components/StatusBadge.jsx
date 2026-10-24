import React from 'react';

export const StatusBadge = ({ status, size = 'md' }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let textColor = '#94a3b8';
  let bgColor = 'rgba(148, 163, 184, 0.12)';
  let borderColor = 'rgba(148, 163, 184, 0.22)';
  let dotColor = '#94a3b8';

  switch (normalized) {
    case 'completed':
    case 'active':
    case 'delivered':
    case 'high':
    case 'paid':
      textColor = '#34d399';
      bgColor = 'rgba(16, 185, 129, 0.14)';
      borderColor = 'rgba(16, 185, 129, 0.28)';
      dotColor = '#10b981';
      break;
    case 'processing':
    case 'pending':
    case 'medium':
    case 'in review':
      textColor = '#fbbf24';
      bgColor = 'rgba(245, 158, 11, 0.14)';
      borderColor = 'rgba(245, 158, 11, 0.28)';
      dotColor = '#f59e0b';
      break;
    case 'shipped':
    case 'lead':
    case 'on track':
      textColor = '#ff7e82';
      bgColor = 'rgba(255, 90, 95, 0.14)';
      borderColor = 'rgba(255, 90, 95, 0.28)';
      dotColor = '#ff5a5f';
      break;
    case 'refunded':
    case 'cancelled':
    case 'low stock':
    case 'at risk':
    case 'failed':
      textColor = '#f87171';
      bgColor = 'rgba(239, 68, 68, 0.14)';
      borderColor = 'rgba(239, 68, 68, 0.28)';
      dotColor = '#ef4444';
      break;
    case 'discontinued':
    case 'inactive':
    case 'draft':
      textColor = '#94a3b8';
      bgColor = 'rgba(148, 163, 184, 0.12)';
      borderColor = 'rgba(148, 163, 184, 0.22)';
      dotColor = '#64748b';
      break;
    default:
      textColor = '#ff7e82';
      bgColor = 'rgba(255, 90, 95, 0.14)';
      borderColor = 'rgba(255, 90, 95, 0.28)';
      dotColor = '#ff5a5f';
  }

  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: isSmall ? '0.15rem 0.55rem' : '0.25rem 0.75rem',
        borderRadius: '9999px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        fontSize: isSmall ? '0.72rem' : '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.01em',
        textTransform: 'capitalize',
        color: textColor,
        boxShadow: 'none',
        whiteSpace: 'nowrap'
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          boxShadow: `0 0 6px ${dotColor}`,
          display: 'inline-block'
        }}
      />
      {status}
    </span>
  );
};

export default StatusBadge;
