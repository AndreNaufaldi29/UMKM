'use client';

import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const getPageItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items = [1];

    if (currentPage <= 3) {
      items.push(2, 3);
      if (currentPage === 3 && totalPages > 4) {
        items.push(4);
      }
      items.push('...');
    } else if (currentPage >= totalPages - 2) {
      items.push('...');
      if (currentPage === totalPages - 2 && totalPages - 3 > 1) {
        items.push(totalPages - 3);
      }
      items.push(totalPages - 2, totalPages - 1);
    } else {
      items.push('...');
      items.push(currentPage - 1, currentPage, currentPage + 1);
      items.push('...');
    }

    if (!items.includes(totalPages)) {
      items.push(totalPages);
    }

    return items;
  };

  const pageItems = getPageItems();

  const handlePageClick = (page) => {
    if (page === currentPage || page === '...') return;
    onPageChange(page);
    try {
      const topAnchor = document.querySelector('.dir-toolbar') || document.querySelector('main');
      if (topAnchor) {
        topAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="pagination" role="navigation" aria-label="Navigasi Halaman">
      {/* TOMBOL PREVIOUS */}
      <button
        type="button"
        className="page-btn page-arrow"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Halaman Sebelumnya"
        title="Halaman Sebelumnya"
        style={{
          cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage <= 1 ? 0.35 : 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          lineHeight: 1
        }}
      >
        ‹
      </button>

      {/* NOMOR HALAMAN & TITIK-TITIK (ELLIPSIS) */}
      {pageItems.map((item, idx) => {
        if (item === '...') {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="page-ellipsis"
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '38px',
                fontWeight: 700,
                color: 'var(--ink-soft)',
                userSelect: 'none',
                fontSize: '0.95rem'
              }}
            >
              …
            </span>
          );
        }

        const isCurrent = currentPage === item;
        return (
          <button
            key={item}
            type="button"
            className={`page-btn ${isCurrent ? 'active' : ''}`}
            onClick={() => handlePageClick(item)}
            aria-current={isCurrent ? 'page' : undefined}
            aria-label={`Halaman ${item}`}
            style={{
              cursor: isCurrent ? 'default' : 'pointer',
              transition: 'all 0.18s ease'
            }}
          >
            {item}
          </button>
        );
      })}

      {/* TOMBOL NEXT */}
      <button
        type="button"
        className="page-btn page-arrow"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Halaman Berikutnya"
        title="Halaman Berikutnya"
        style={{
          cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage >= totalPages ? 0.35 : 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          lineHeight: 1
        }}
      >
        ›
      </button>
    </div>
  );
}