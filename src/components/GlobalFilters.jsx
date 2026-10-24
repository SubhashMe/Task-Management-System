import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import {
  Filter,
  RotateCcw,
  Calendar,
  Globe,
  Tag,
  Share2,
  Users,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DATE_PRESETS } from '../utils/dateUtils';

export const GlobalFilters = () => {
  const {
    dateRange,
    setDateRange,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    selectedRegion,
    setSelectedRegion,
    selectedCategory,
    setSelectedCategory,
    selectedChannel,
    setSelectedChannel,
    selectedSegment,
    setSelectedSegment,
    selectedStatus,
    setSelectedStatus,
    categories,
    regions,
    activeFilterCount,
    resetAllFilters
  } = useAnalytics();

  const [expanded, setExpanded] = useState(false);

  const channels = ['All', 'Direct Enterprise', 'Inbound Web', 'Partner Network', 'Strategic Resellers'];
  const segments = ['All', 'Enterprise', 'Mid-Market', 'SMB', 'Startup'];
  const statuses = ['All', 'Completed', 'Shipped', 'Processing', 'Refunded'];

  return (
    <div
      className="card mb-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      <div className="p-3">
        {/* Main Filter Row: Date Range Presets & Filter Toggle */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          {/* Left: Quick Date Range Pills */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span
              className="d-flex align-items-center gap-1.5 text-secondary"
              style={{ fontSize: '0.8rem', fontWeight: 600 }}
            >
              <Calendar size={14} />
              Period:
            </span>
            <div
              className="btn-group btn-group-sm p-1 rounded-pill"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)'
              }}
            >
              {DATE_PRESETS.map((preset) => {
                const isActive = dateRange === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setDateRange(preset.value)}
                    className="btn btn-sm"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 600 : 500,
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                      border: 'none',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      boxShadow: isActive ? '0 2px 8px rgba(255, 90, 95, 0.4)' : 'none'
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Dimension Filter Toggle & Reset Button */}
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="btn btn-sm d-flex align-items-center gap-1.5"
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                backgroundColor: expanded || activeFilterCount > 0 ? 'rgba(255, 90, 95, 0.15)' : 'var(--bg-subtle)',
                color: expanded || activeFilterCount > 0 ? '#ff7e82' : '#ffffff',
                padding: '6px 14px'
              }}
            >
              <Filter size={14} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    fontSize: '0.68rem',
                    padding: '0.2rem 0.45rem',
                    fontWeight: 700
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="btn btn-sm d-flex align-items-center gap-1"
                style={{
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-full)',
                  padding: '5px 12px'
                }}
                title="Reset all filters"
              >
                <RotateCcw size={13} />
                <span className="d-none d-sm-inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Custom Date Range Picker when CUSTOM is selected */}
        {dateRange === 'CUSTOM' && (
          <div
            className="row g-2 align-items-center mt-2 pt-2"
            style={{ borderTop: '1px solid var(--border-color)' }}
          >
            <div className="col-12 col-sm-auto text-secondary fw-semibold" style={{ fontSize: '0.8rem' }}>
              Select Custom Window:
            </div>
            <div className="col-auto">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="form-control form-control-sm"
                style={{
                  backgroundColor: '#171924',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-sm)'
                }}
              />
            </div>
            <div className="col-auto text-secondary fw-semibold" style={{ fontSize: '0.8rem' }}>
              to
            </div>
            <div className="col-auto">
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="form-control form-control-sm"
                style={{
                  backgroundColor: '#171924',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-sm)'
                }}
              />
            </div>
          </div>
        )}

        {/* Collapsible Dimension Filter Selectors */}
        {expanded && (
          <div
            className="row g-3 mt-1 pt-3 animate-fade-in"
            style={{ borderTop: '1px solid var(--border-color)' }}
          >
            {/* Region */}
            <div className="col-6 col-md-4 col-lg-2">
              <label
                className="form-label d-flex align-items-center gap-1 mb-1"
                style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              >
                <Globe size={12} /> Region
              </label>
              <select
                className="form-select form-select-sm"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                style={{
                  backgroundColor: '#171924',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <option value="All">All Regions</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="col-6 col-md-4 col-lg-3">
              <label
                className="form-label d-flex align-items-center gap-1 mb-1"
                style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              >
                <Tag size={12} /> Category
              </label>
              <select
                className="form-select form-select-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  backgroundColor: '#171924',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Channel */}
            <div className="col-6 col-md-4 col-lg-2">
              <label
                className="form-label d-flex align-items-center gap-1 mb-1"
                style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              >
                <Share2 size={12} /> Sales Channel
              </label>
              <select
                className="form-select form-select-sm"
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                style={{
                  backgroundColor: '#171924',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {channels.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch === 'All' ? 'All Channels' : ch}
                  </option>
                ))}
              </select>
            </div>

            {/* Segment */}
            <div className="col-6 col-md-4 col-lg-2">
              <label
                className="form-label d-flex align-items-center gap-1 mb-1"
                style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              >
                <Users size={12} /> Segment
              </label>
              <select
                className="form-select form-select-sm"
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                style={{
                  backgroundColor: '#171924',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {segments.map((seg) => (
                  <option key={seg} value={seg}>
                    {seg === 'All' ? 'All Segments' : seg}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="col-6 col-md-4 col-lg-3">
              <label
                className="form-label d-flex align-items-center gap-1 mb-1"
                style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              >
                <CheckCircle size={12} /> Order Status
              </label>
              <select
                className="form-select form-select-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  backgroundColor: '#171924',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st === 'All' ? 'All Statuses' : st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div
            className="d-flex flex-wrap align-items-center gap-2 mt-2 pt-2"
            style={{ borderTop: '1px solid var(--border-color)' }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Active Filters:
            </span>

            {dateRange !== '12M' && (
              <span
                key="chip-date"
                className="badge d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill"
                style={{
                  backgroundColor: 'rgba(255, 90, 95, 0.15)',
                  color: '#ff7e82',
                  border: '1px solid rgba(255, 90, 95, 0.25)',
                  fontSize: '0.74rem',
                  fontWeight: 600
                }}
              >
                Period: {dateRange}
                <X
                  size={12}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setDateRange('12M')}
                />
              </span>
            )}

            {selectedRegion !== 'All' && (
              <span
                key="chip-region"
                className="badge d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '0.74rem',
                  fontWeight: 600
                }}
              >
                Region: {selectedRegion}
                <X
                  size={12}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedRegion('All')}
                />
              </span>
            )}

            {selectedCategory !== 'All' && (
              <span
                key="chip-category"
                className="badge d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill"
                style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#7dd3fc',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  fontSize: '0.74rem',
                  fontWeight: 600
                }}
              >
                Category: {selectedCategory}
                <X
                  size={12}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedCategory('All')}
                />
              </span>
            )}

            {selectedChannel !== 'All' && (
              <span
                key="chip-channel"
                className="badge d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill"
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  fontSize: '0.74rem',
                  fontWeight: 600
                }}
              >
                Channel: {selectedChannel}
                <X
                  size={12}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedChannel('All')}
                />
              </span>
            )}

            {selectedSegment !== 'All' && (
              <span
                key="chip-segment"
                className="badge d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill"
                style={{
                  backgroundColor: 'rgba(192, 132, 252, 0.15)',
                  color: '#d8b4fe',
                  border: '1px solid rgba(192, 132, 252, 0.25)',
                  fontSize: '0.74rem',
                  fontWeight: 600
                }}
              >
                Segment: {selectedSegment}
                <X
                  size={12}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedSegment('All')}
                />
              </span>
            )}

            {selectedStatus !== 'All' && (
              <span
                key="chip-status"
                className="badge d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill"
                style={{
                  backgroundColor: 'rgba(244, 63, 94, 0.15)',
                  color: '#fda4af',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  fontSize: '0.74rem',
                  fontWeight: 600
                }}
              >
                Status: {selectedStatus}
                <X
                  size={12}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedStatus('All')}
                />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalFilters;
