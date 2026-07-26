'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useData } from '../../src/context/DataContext';
import { AdminIcon, ResetIcon, ArrowIcon } from '../../src/components/Icons';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { msmes, products, reviews, resetToDefault } = useData();

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh data UMKM, Produk, dan Ulasan ke data awal default?')) {
      resetToDefault();
    }
  };

  const navTabs = [
    { href: '/admin', label: 'Overview', icon: '📊' },
    { href: '/admin/umkm', label: 'Kelola UMKM', count: msmes.length, icon: '🏪' },
    { href: '/admin/products', label: 'Kelola Produk', count: products.length, icon: '🛍️' },
    { href: '/admin/reviews', label: 'Kelola Review', count: reviews.length, icon: '⭐' },
  ];

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div className="admin-container">
      {/* ADMIN HEADER BAR */}
      <header className="admin-header wrap">
        <div className="admin-header-left">
          <div className="admin-badge">
            <AdminIcon width="16" height="16" />
            <span>Panel Administrator</span>
          </div>
          <h1 className="admin-title">Sistem Manajemen UMKM Desa</h1>
        </div>

        <div className="admin-header-right">
          <button className="btn btn-outline btn-sm" onClick={handleReset} title="Reset Data ke Default">
            <ResetIcon width="14" height="14" />
            <span>Reset Data</span>
          </button>

          <Link href="/" className="btn btn-soil btn-sm">
            <span>Situs Publik</span>
            <ArrowIcon width="12" height="12" />
          </Link>
        </div>
      </header>

      {/* ADMIN NAVIGATION TABS */}
      <div className="wrap">
        <nav className="admin-nav-tabs">
          {navTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`admin-tab ${isActive ? 'active' : ''}`}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`tab-count ${tab.href === '/admin/reviews' && pendingCount > 0 ? 'highlight' : ''}`}>
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="wrap admin-content">{children}</main>
    </div>
  );
}
