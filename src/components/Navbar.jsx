'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../app/providers';
import { SunIcon, MoonIcon, AdminIcon } from './Icons';
import { withBasePath } from '../utils/basePath';

export default function Navbar() {
  const pathname = usePathname();
  const { dark, toggleDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand" onClick={() => setIsOpen(false)}>
          <div className="">
            <img
              src={withBasePath('/logo.png')}
              alt="Logo Desa Kedungsumur"
              width="30"
              height="30"
            />
          </div>
          <div>
            Desa Kedungsumur
            <small>Website UMKM Desa</small>
          </div>
        </Link>

        <nav className="nav-links">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>
            Beranda
          </Link>
          <Link href="/umkm" className={pathname.startsWith('/umkm') ? 'active' : ''}>
            UMKM Desa
          </Link>
          <Link href="/produk" className={pathname.startsWith('/produk') ? 'active' : ''}>
            Katalog Produk
          </Link>
        </nav>

        <div className="nav-right">
          <button
            className="icon-btn"
            onClick={toggleDark}
            title="Ganti tampilan"
            aria-label="Toggle theme" suppressHydrationWarning
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {mounted && dark ? <SunIcon /> : <MoonIcon />}
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
            <Link href="/produk" className={pathname.startsWith('/produk') ? 'active' : ''} onClick={() => setIsOpen(false)}>
              Katalog Produk
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
