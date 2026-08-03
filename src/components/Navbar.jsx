'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../app/providers';
import { SunIcon, MoonIcon, AdminIcon } from './Icons';

export default function Navbar() {
  const pathname = usePathname();
  const { dark, toggleDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand" onClick={() => setIsOpen(false)}>
          <div className="brand-mark">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6" />
            </svg>
          </div>
          <div>
            Desa Kedungsumur
            <small>Website Profil Desa</small>
          </div>
        </Link>

        <nav className="nav-links">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>
            Beranda
          </Link>
          <Link href="/umkm" className={pathname.startsWith('/umkm') ? 'active' : ''}>
            UMKM Desa
          </Link>
          <Link href="/products" className={pathname.startsWith('/products') ? 'active' : ''}>
            Katalog Produk
          </Link>
        </nav>

        <div className="nav-right">
          <button
            className="icon-btn"
            onClick={toggleDark}
            title="Ganti tampilan"
            aria-label="Toggle theme"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* HAMBURGER BUTTON */}
          <button
            className={`hamburger-btn ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu navigasi"
            aria-expanded={isOpen}
          >
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </button>
        </div>
      </div>

      {/* MOBILE SIDEBAR DRAWER */}
      <div className={`nav-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-overlay" onClick={() => setIsOpen(false)} />
        <div className="drawer-content">
          <div className="drawer-header">
            <span className="drawer-title">Desa Kedungsumur</span>
          </div>
          <nav className="drawer-links">
            <Link href="/" className={pathname === '/' ? 'active' : ''} onClick={() => setIsOpen(false)}>
              Beranda
            </Link>
            <Link href="/umkm" className={pathname.startsWith('/umkm') ? 'active' : ''} onClick={() => setIsOpen(false)}>
              UMKM Desa
            </Link>
            <Link href="/products" className={pathname.startsWith('/products') ? 'active' : ''} onClick={() => setIsOpen(false)}>
              Katalog Produk
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
