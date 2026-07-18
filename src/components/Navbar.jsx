'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../app/providers';
import { SunIcon, MoonIcon } from './Icons';

export default function Navbar() {
  const pathname = usePathname();
  const { dark, toggleDark } = useTheme();

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <div className="brand-mark">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F6F1E4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6" />
            </svg>
          </div>
          <div>
            Desa Sukamaju
            <small>Website Profil Desa</small>
          </div>
        </Link>

        <nav className="nav-links">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>
            Beranda
          </Link>
          <Link href="/directory" className={pathname.startsWith('/directory') ? 'active' : ''}>
            UMKM Desa
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
        </div>
      </div>
    </header>
  );
}
