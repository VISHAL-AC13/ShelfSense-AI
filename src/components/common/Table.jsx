import React, { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { Badge } from './Badge';

export const Table = ({
  data = [],
  columns = [],
  searchPlaceholder = "Search shipments, tracking IDs, cargo or client...",
  onRowClick,
  actionsRender,
  initialSortKey = 'id'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: initialSortKey, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter & Search
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter((item) => {
      return Object.values(item).some((val) => {
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(lowerSearch);
        }
        if (typeof val === 'object' && val !== null) {
          return Object.values(val).some((subVal) => String(subVal).toLowerCase().includes(lowerSearch));
        }
        return false;
      });
    });
  }, [data, searchTerm]);

  // Sort
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === 'object' && aValue !== null && aValue.city) aValue = aValue.city;
        if (typeof bValue === 'object' && bValue !== null && bValue.city) bValue = bValue.city;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status) => {
    if (status.includes('Active')) return <Badge variant="emerald" pulse>{status}</Badge>;
    if (status.includes('Intervention') || status.includes('Warning')) return <Badge variant="amber" pulse>{status}</Badge>;
    if (status.includes('Delivered') || status.includes('Optimal')) return <Badge variant="sky">{status}</Badge>;
    if (status.includes('Critical') || status.includes('Alert')) return <Badge variant="red" pulse>{status}</Badge>;
    return <Badge variant="slate">{status}</Badge>;
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Search & Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          padding: '1rem 1.5rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.03)'
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '480px' }}>
          <Icons.Search
            size={18}
            color="#64748B"
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.75rem',
              borderRadius: '12px',
              border: '1px solid rgba(203, 213, 225, 0.8)',
              backgroundColor: '#F8FAFC',
              fontSize: '0.9rem',
              color: '#0F172A',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#0EA5E9';
              e.target.style.backgroundColor = '#FFFFFF';
              e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(203, 213, 225, 0.8)';
              e.target.style.backgroundColor = '#F8FAFC';
              e.target.style.boxShadow = 'none';
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8'
              }}
            >
              <Icons.X size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#64748B' }}>
          <span>Showing <strong style={{ color: '#0F172A' }}>{sortedData.length}</strong> records</span>
        </div>
      </div>

      {/* Table Container */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.04)',
          overflowX: 'auto'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid rgba(226, 232, 240, 0.9)' }}>
              {columns.map((col, index) => (
                <th
                  key={col.key || index}
                  onClick={() => col.sortable !== false && requestSort(col.key)}
                  style={{
                    padding: '1rem 1.25rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#475569',
                    cursor: col.sortable !== false ? 'pointer' : 'default',
                    userSelect: 'none',
                    borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#F8FAFC',
                    zIndex: 10
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      <span style={{ display: 'inline-flex', flexDirection: 'column', color: '#94A3B8' }}>
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? <Icons.ChevronUp size={14} color="#0EA5E9" /> : <Icons.ChevronDown size={14} color="#0EA5E9" />
                        ) : (
                          <Icons.ChevronsUpDown size={14} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actionsRender && (
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', borderBottom: '1px solid rgba(226, 232, 240, 0.9)', textAlign: 'right' }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actionsRender ? 1 : 0)} style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748B' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <Icons.Inbox size={40} color="#CBD5E1" />
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: '#334155' }}>No shipments found matching query</span>
                    <span style={{ fontSize: '0.85rem' }}>Try adjusting your search filter or clear active parameters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'all 0.15s ease',
                    borderBottom: rowIndex === paginatedData.length - 1 ? 'none' : '1px solid rgba(241, 245, 249, 0.9)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {columns.map((col, colIndex) => {
                    let val = row[col.key];
                    if (col.render) {
                      val = col.render(row, val);
                    } else if (col.key === 'status') {
                      val = getStatusBadge(val);
                    } else if (typeof val === 'object' && val !== null && val.city) {
                      val = val.city;
                    }
                    return (
                      <td
                        key={col.key || colIndex}
                        style={{
                          padding: '1.1rem 1.25rem',
                          fontSize: '0.9rem',
                          color: '#0F172A',
                          borderBottom: rowIndex === paginatedData.length - 1 ? 'none' : '1px solid rgba(241, 245, 249, 0.9)'
                        }}
                      >
                        {val}
                      </td>
                    );
                  })}
                  {actionsRender && (
                    <td
                      style={{
                        padding: '1.1rem 1.25rem',
                        textAlign: 'right',
                        borderBottom: rowIndex === paginatedData.length - 1 ? 'none' : '1px solid rgba(241, 245, 249, 0.9)'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {actionsRender(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid rgba(226, 232, 240, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Page <strong style={{ color: '#0F172A' }}>{currentPage}</strong> of <strong style={{ color: '#0F172A' }}>{totalPages}</strong>
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid rgba(203, 213, 225, 0.8)',
                backgroundColor: currentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                color: currentPage === 1 ? '#94A3B8' : '#0F172A',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Icons.ChevronLeft size={16} /> Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid rgba(203, 213, 225, 0.8)',
                backgroundColor: currentPage === totalPages ? '#F1F5F9' : '#FFFFFF',
                color: currentPage === totalPages ? '#94A3B8' : '#0F172A',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
            >
              Next <Icons.ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
