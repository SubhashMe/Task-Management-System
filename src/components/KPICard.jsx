import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, HelpCircle } from 'lucide-react';

export const KPICard = ({
  title,
  value,
  delta = { percentChange: '0%', trendType: 'neutral' },
  comparisonLabel = 'vs previous period',
  tooltip = '',
  sparklineData = [12, 19, 15, 27, 24, 32, 28, 38],
  icon: Icon,
  invertTrendColor = false // If positive is bad (e.g., refund rate or CPA)
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const isPositive = delta.trendType === 'positive';
  const isNegative = delta.trendType === 'negative';
  
  // Color determination
  let trendColor = '#64748b';
  let TrendIcon = Minus;
  let bgBadge = 'rgba(100, 116, 139, 0.1)';

  if (isPositive) {
    trendColor = invertTrendColor ? '#ef4444' : '#10b981';
    TrendIcon = ArrowUpRight;
    bgBadge = invertTrendColor ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)';
  } else if (isNegative) {
    trendColor = invertTrendColor ? '#10b981' : '#ef4444';
    TrendIcon = ArrowDownRight;
    bgBadge = invertTrendColor ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
  }

  // Generate SVG path for sparkline
  const width = 80;
  const height = 30;
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Unique gradient ID for each card's sparkline
  const gradientId = `spark-grad-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  // Area path closing coordinates for glowing fill
  const areaPoints = `${points} ${width.toFixed(1)},${height.toFixed(1)} 0,${height.toFixed(1)}`;

  return (
    <div
      className="card kpi-card card-hover h-100 position-relative"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        padding: '20px'
      }}
    >
      {/* Top Header: Title on Left, Subtle Arrow on Right (matching screenshot) */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-1.5">
          <span
            style={{
              fontSize: '0.84rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              letterSpacing: '0.01em'
            }}
          >
            {title}
          </span>

          {tooltip && (
            <div
              className="position-relative d-inline-block ms-1"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <HelpCircle
                size={13}
                style={{
                  color: 'var(--text-muted)',
                  cursor: 'help',
                  verticalAlign: 'middle'
                }}
              />
              {showTooltip && (
                <div
                  className="position-absolute rounded-3 p-2 text-start"
                  style={{
                    bottom: '120%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '210px',
                    backgroundColor: '#171924',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    lineHeight: '1.4',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 100,
                    pointerEvents: 'none'
                  }}
                >
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          {Icon && (
            <Icon size={15} style={{ color: 'var(--text-muted)' }} />
          )}
          <span style={{ color: 'var(--text-muted)', fontSize: '0.92rem', transition: 'transform 0.2s' }}>&rarr;</span>
        </div>
      </div>

      {/* Main Metric Value & Glowing Sparkline (Left text & metric, Right chart) */}
      <div className="d-flex align-items-end justify-content-between my-auto">
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.15
            }}
          >
            {value}
          </div>

          {/* Sub-metric row under main value */}
          <div className="d-flex align-items-center gap-2 mt-2">
            <span
              className="d-inline-flex align-items-center gap-1 px-2 py-0.5 font-mono"
              style={{
                backgroundColor: bgBadge,
                color: trendColor === '#10b981' ? '#34d399' : '#f87171',
                fontSize: '0.72rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)'
              }}
            >
              <TrendIcon size={12} strokeWidth={2.6} />
              {delta.percentChange}
            </span>
            <span
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                fontWeight: 500
              }}
            >
              {comparisonLabel}
            </span>
          </div>
        </div>

        {/* Mini SVG Sparkline with glowing area gradient */}
        <div style={{ width: `${width}px`, height: `${height}px` }} className="flex-shrink-0 ms-2">
          <svg width={width} height={height} style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={trendColor === '#10b981' ? '#10b981' : '#ff5a5f'} stopOpacity={0.35} />
                <stop offset="100%" stopColor={trendColor === '#10b981' ? '#10b981' : '#ff5a5f'} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <polygon
              fill={`url(#${gradientId})`}
              points={areaPoints}
            />
            <polyline
              fill="none"
              stroke={trendColor === '#10b981' ? '#10b981' : '#ff5a5f'}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default KPICard;
