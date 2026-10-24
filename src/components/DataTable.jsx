import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Search
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { EmptyState } from './EmptyState';

export const DataTable = ({
  columns = [],
  data = [],
  defaultSortKey = '',
  defaultSortDirection = 'desc',
  title = '',
  exportFilename = 'export.csv',
  searchable = true,
  searchPlaceholder = 'Filter rows...',
  emptyTitle = 'No records found',
  emptyDescription = 'There are no records matching your current filter selection.',
  actionButton
}) => {
  const { tableDensity, exportToCSV } = useAnalytics();

  const [sortKey, setSortKey] = useState(defaultSortKey || (columns[0]?.key || ''));
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting Handler
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Filtered & Sorted Data
  const processedData = useMemo(() => {
    let result = [...data];

    // Local Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) =>
          val !== null && val !== undefined && String(val).toLowerCase().includes(q)
        )
      );
    }

    // Sorting
    if (sortKey) {
      result.sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        // Handle numeric values
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        // Strings & Dates
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortKey, sortDirection]);

  // Pagination Slice
  const totalRecords = processedData.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  // Adjust page if data length changes
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  // Density padding configuration
  const densityStyles = {
    compact: { py: '0.45rem', px: '0.75rem', fontSize: '0.775rem' },
    standard: { py: '0.75rem', px: '1rem', fontSize: '0.825rem' },
    spacious: { py: '1rem', px: '1.25rem', fontSize: '0.875rem' }
  };
  const currentDensity = densityStyles[tableDensity] || densityStyles.standard;

  // CSV Export
  const handleExport = () => {
    if (data.length === 0) return;
    exportToCSV(data, exportFilename);
  };

  return (
    <div
      className="card"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden'
      }}
    >
      {/* Table Action Bar */}
      <div
        className="p-3 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <div className="d-flex align-items-center gap-2">
          {title && (
            <h6
              className="fw-bold mb-0 me-2"
              style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700 }}
            >
              {title}
            </h6>
          )}
          <span
            className="badge rounded-pill"
            style={{
              backgroundColor: 'rgba(255, 90, 95, 0.15)',
              color: '#ff7e82',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '4px 10px'
            }}
          >
            {totalRecords} record{totalRecords === 1 ? '' : 's'}
          </span>
        </div>

        <div className="d-flex align-items-center gap-2 ms-auto flex-wrap">
          {searchable && (
            <div className="position-relative" style={{ width: '220px' }}>
              <Search
                size={14}
                className="position-absolute"
                style={{
                  top: '50%',
                  left: '12px',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-control form-control-sm ps-4"
                style={{
                  backgroundColor: '#171924',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-full)',
                  paddingLeft: '32px'
                }}
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleExport}
            className="btn btn-sm d-flex align-items-center gap-1.5"
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-subtle)',
              color: '#ffffff',
              padding: '6px 14px'
            }}
            title="Download CSV"
          >
            <Download size={14} />
            <span className="d-none d-sm-inline">Export</span>
          </button>

          {actionButton}
        </div>
      </div>

      {/* Table Container */}
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table
          className="table mb-0 align-middle"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <thead style={{ backgroundColor: '#171924', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              {columns.map((col) => {
                const isSortable = col.sortable !== false;
                const isCurrentSort = sortKey === col.key;

                return (
                  <th
                    key={col.key}
                    onClick={() => isSortable && handleSort(col.key)}
                    style={{
                      padding: `${currentDensity.py} ${currentDensity.px}`,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: 'var(--text-secondary)',
                      backgroundColor: '#171924',
                      cursor: isSortable ? 'pointer' : 'default',
                      whiteSpace: 'nowrap',
                      textAlign: col.align || 'left',
                      borderBottom: '1px solid var(--border-color)',
                      userSelect: 'none'
                    }}
                  >
                    <div
                      className={`d-flex align-items-center gap-1 ${
                        col.align === 'right'
                          ? 'justify-content-end'
                          : col.align === 'center'
                          ? 'justify-content-center'
                          : 'justify-content-start'
                      }`}
                    >
                      <span>{col.title}</span>
                      {isSortable && (
                        <span className="text-muted" style={{ opacity: isCurrentSort ? 1 : 0.4 }}>
                          {isCurrentSort ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp size={12} color="var(--primary)" />
                            ) : (
                              <ArrowDown size={12} color="var(--primary)" />
                            )
                          ) : (
                            <ArrowUpDown size={12} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="table-row-hover"
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: `${currentDensity.py} ${currentDensity.px}`,
                        fontSize: currentDensity.fontSize,
                        textAlign: col.align || 'left',
                        whiteSpace: col.wrap ? 'normal' : 'nowrap',
                        color: '#e2e8f0'
                      }}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-0 border-0">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    showAction={false}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalRecords > 0 && (
        <div
          className="p-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-2"
          style={{
            borderTop: '1px solid var(--border-color)',
            backgroundColor: '#171924',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)'
          }}
        >
          {/* Left: Range and Page Size selector */}
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>
              Showing{' '}
              <strong style={{ fontWeight: 700, color: '#ffffff' }}>
                {Math.min((currentPage - 1) * pageSize + 1, totalRecords)} -{' '}
                {Math.min(currentPage * pageSize, totalRecords)}
              </strong>{' '}
              of <strong style={{ fontWeight: 700, color: '#ffffff' }}>{totalRecords}</strong>
            </span>

            <div className="d-flex align-items-center gap-1.5 ms-2">
              <span className="text-secondary fw-semibold">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="form-select form-select-sm py-0 ps-2 pe-4"
                style={{
                  width: 'auto',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  backgroundColor: '#171924',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Right: Page Navigation */}
          <div className="d-flex align-items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="btn btn-sm p-1 d-flex align-items-center justify-content-center"
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                opacity: currentPage === 1 ? 0.35 : 1
              }}
              title="First Page"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-sm p-1 d-flex align-items-center justify-content-center"
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                opacity: currentPage === 1 ? 0.35 : 1
              }}
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="px-2" style={{ fontWeight: 600, color: '#ffffff' }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn btn-sm p-1 d-flex align-items-center justify-content-center"
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                opacity: currentPage === totalPages ? 0.35 : 1
              }}
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="btn btn-sm p-1 d-flex align-items-center justify-content-center"
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                opacity: currentPage === totalPages ? 0.35 : 1
              }}
              title="Last Page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
