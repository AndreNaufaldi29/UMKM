'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isEntering, setIsEntering] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const isFirstRender = useRef(true);
  const exitTimerRef = useRef(null);
  const removeTimerRef = useRef(null);
  const fallbackTimerRef = useRef(null);

  const clearAllTimers = () => {
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (removeTimerRef.current) clearTimeout(removeTimerRef.current);
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
  };

  const startExitSequence = (duration = 250) => {
    clearAllTimers();

    exitTimerRef.current = setTimeout(() => {
      setIsExiting(true);
    }, duration);

    removeTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setIsEntering(false);
      setIsExiting(false);
    }, duration + 480);
  };

  // Tangkap klik navigasi secara instan saat link atau kartu ditekan
  useEffect(() => {
    const handleLinkClick = (e) => {
      const targetEl = e.target.closest('a, .product-catalog-card, .cat-home-card, .card');
      if (!targetEl) return;
      
      const href = targetEl.getAttribute('href');

      // Abaikan animasi loader untuk panel admin
      if (href && href.startsWith('/admin')) {
        return;
      }

      if (targetEl.classList.contains('product-catalog-card')) {
        setIsEntering(true);
        setIsLoading(true);
        setIsExiting(false);
        clearAllTimers();
        fallbackTimerRef.current = setTimeout(() => {
          startExitSequence(300);
        }, 1200);
        return;
      }

      if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('#')) {
        const cleanHref = href.split('?')[0].split('#')[0];
        const cleanPathname = pathname.split('?')[0].split('#')[0];
        
        if (cleanHref === cleanPathname) {
          return;
        }

        setIsEntering(true);
        setIsLoading(true);
        setIsExiting(false);
        clearAllTimers();
        fallbackTimerRef.current = setTimeout(() => {
          startExitSequence(300);
        }, 1200);
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => {
      document.removeEventListener('click', handleLinkClick);
      clearAllTimers();
    };
  }, [pathname]);

  // Pemicu tunggal saat rute benar-benar berubah
  useEffect(() => {
    if (pathname && pathname.startsWith('/admin')) return;

    setIsLoading(true);
    setIsExiting(false);
    window.scrollTo(0, 0);

    const loadDuration = isFirstRender.current ? 400 : 250;
    isFirstRender.current = false;

    startExitSequence(loadDuration);

    return () => {
      clearAllTimers();
    };
  }, [pathname]);

  if (pathname && pathname.startsWith('/admin')) return null;
  if (!isLoading) return null;

  return (
    <div className={`page-loader-overlay ${isEntering ? 'is-entering' : ''} ${isExiting ? 'exit' : ''}`} aria-hidden="true" suppressHydrationWarning>
      <div className="loader-content">
        <div className="loader-logo-wrap">
          <div className="loader-brand-mark">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="loader-glow-ring"></div>
        </div>

        <h1 className="loader-title">Kedung Sumur</h1>
        <p className="loader-subtitle">Katalog UMKM & Ekonomi Desa</p>

        <div className="loader-progress-track">
          <div className="loader-progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
