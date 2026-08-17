'use client';

import React, { useRef, useState, useEffect } from 'react';
import MSMECard from './MSMECard';

export default function LatestMSMECarousel({ latestMSMEs }) {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [latestMSMEs]);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -310, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 310, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', padding: '0 4px' }}>
      {/* LEFT NAVIGATION ARROW */}
      <button
        type="button"
        onClick={scrollLeft}
        disabled={!canScrollLeft}
        className="icon-btn latest-carousel-arrow left-arrow"
        aria-label="Geser ke kiri"
        style={{
          position: 'absolute',
          left: '-16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 12,
          opacity: canScrollLeft ? 1 : 0,
          cursor: canScrollLeft ? 'pointer' : 'default',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          border: '1px solid var(--line)',
          background: 'var(--paper)',
          color: 'var(--ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
          pointerEvents: canScrollLeft ? 'auto' : 'none'
        }}
      >
        &#10094;
      </button>

      {/* RIGHT NAVIGATION ARROW */}
      <button
        type="button"
        onClick={scrollRight}
        disabled={!canScrollRight}
        className="icon-btn latest-carousel-arrow right-arrow"
        aria-label="Geser ke kanan"
        style={{
          position: 'absolute',
          right: '-16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 12,
          opacity: canScrollRight ? 1 : 0,
          cursor: canScrollRight ? 'pointer' : 'default',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          border: '1px solid var(--line)',
          background: 'var(--paper)',
          color: 'var(--ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
          pointerEvents: canScrollRight ? 'auto' : 'none'
        }}
      >
        &#10095;
      </button>

      {/* CAROUSEL TRACK WITH HIDDEN SCROLLBAR & NO CLIPPING */}
      <div
        ref={containerRef}
        className="latest-scroll"
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '14px 6px 22px',
          margin: '-14px -6px -22px'
        }}
      >
        {latestMSMEs.map((m) => (
          <div key={m.id} className="latest-scroll-item" style={{ minWidth: '280px', maxWidth: '320px', flex: '0 0 280px', display: 'flex' }}>
            <MSMECard m={m} />
          </div>
        ))}
      </div>
    </div>
  );
}
