'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useData } from '../../src/context/DataContext';
import { useAuth } from '../../src/context/AuthContext';
import AdminAuthGuard from '../../src/components/AdminAuthGuard';
import { AdminIcon, ResetIcon, ArrowIcon, XIcon } from '../../src/components/Icons';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { msmes, products, resetToDefault } = useData();
  const { logout, adminUser } = useAuth();

  // Reset state
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting]       = useState(false);
  const [resetResult, setResetResult]       = useState(null); // { type: 'success'|'error', message: string, deleted?: {} }

  const handleResetClick = () => {
    setResetResult(null);
    setShowResetModal(true);
  };

  const handleResetConfirm = async () => {
    setIsResetting(true);
    setResetResult(null);
    try {
      const result = await resetToDefault();
      if (result?.success) {
        const { deleted } = result;
        const detail = deleted
          ? `${deleted.umkm} UMKM dan ${deleted.products} produk telah dihapus.`
          : '';
        setResetResult({
          type:    'success',
          message: `✅ Reset berhasil! ${detail} Database kembali ke kondisi awal.`,
        });
      } else {
        setResetResult({
          type:    'error',
          message: `❌ Reset gagal: ${result?.error || 'Terjadi kesalahan tidak diketahui.'}`,
        });
      }
    } catch (err) {
      setResetResult({
        type:    'error',
        message: `❌ Reset gagal: ${err.message || 'Koneksi ke server bermasalah.'}`,
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetClose = () => {
    setShowResetModal(false);
    setResetResult(null);
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari Panel Administrator?')) {
      logout();
    }
  };

  const navTabs = [
    { href: '/admin',          label: 'Overview',       icon: '📊' },
    { href: '/admin/umkm',     label: 'Kelola UMKM',    count: msmes.length,    icon: '🏪' },
    { href: '/admin/products', label: 'Kelola Produk',  count: products.length, icon: '🛍️' },
  ];

  return (
    <AdminAuthGuard>
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

          <div className="admin-header-right" style={{ gap: '10px' }}>
            {adminUser && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', background: 'var(--forest-soft)', padding: '6px 12px', borderRadius: '8px', fontWeight: 600, color: 'var(--forest)' }}>
                <span>👤</span>
                <span>{adminUser.username}</span>
              </div>
            )}

            <button
              className="btn btn-outline btn-sm btn-reset"
              onClick={handleResetClick}
              title="Reset Data ke Default"
              disabled={isResetting}
            >
              <ResetIcon width="14" height="14" />
              <span>{isResetting ? 'Mereset...' : 'Reset Data'}</span>
            </button>

            <button className="btn btn-outline btn-sm btn-logout" onClick={handleLogout} title="Keluar dari Panel Admin">
              <span>🚪 Keluar</span>
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
                    <span className="tab-count">{tab.count}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="wrap admin-content">{children}</main>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div
          className="modal-overlay"
          onClick={!isResetting ? handleResetClose : undefined}
          style={{ zIndex: 9999 }}
        >
          <div
            className="modal-container modal-sm"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '460px' }}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ResetIcon width="18" height="18" style={{ color: 'var(--red, #ef4444)' }} />
                Reset Data ke Awal
              </h3>
              {!isResetting && (
                <button className="modal-close-btn" onClick={handleResetClose}>
                  <XIcon />
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="modal-body" style={{ padding: '20px 24px' }}>
              {/* Result Feedback — shown after operation */}
              {resetResult ? (
                <div
                  style={{
                    padding:      '14px 16px',
                    borderRadius: '10px',
                    fontSize:     '0.9rem',
                    lineHeight:   '1.55',
                    background:   resetResult.type === 'success' ? 'var(--forest-soft, #e8f5ee)' : '#FDF2F2',
                    border:       `1px solid ${resetResult.type === 'success' ? 'var(--forest, #1e4b3b)' : '#F8B4B4'}`,
                    color:        resetResult.type === 'success' ? 'var(--forest, #1e4b3b)' : '#9B1C1C',
                    fontWeight:   600,
                  }}
                >
                  {resetResult.message}
                </div>
              ) : (
                <>
                  {/* Warning box */}
                  <div
                    style={{
                      background:   '#FFF7ED',
                      border:       '1px solid #FED7AA',
                      borderRadius: '10px',
                      padding:      '12px 16px',
                      marginBottom: '16px',
                      display:      'flex',
                      gap:          '10px',
                      alignItems:   'flex-start',
                    }}
                  >
                    <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>⚠️</span>
                    <div style={{ fontSize: '0.88rem', color: '#92400E', lineHeight: '1.5' }}>
                      <strong>Perhatian:</strong> Tindakan ini akan <strong>menghapus seluruh data UMKM dan produk</strong> secara permanen dari database, lalu mengembalikan ke kondisi awal (kosong).
                    </div>
                  </div>

                  <ul style={{ paddingLeft: '20px', fontSize: '0.86rem', color: 'var(--ink-soft)', lineHeight: '1.7', margin: 0 }}>
                    <li>Semua data UMKM akan dihapus permanen</li>
                    <li>Semua data Produk akan dihapus permanen</li>
                    <li>Semua Sertifikasi akan dihapus permanen</li>
                    <li>Kategori dan akun Admin tetap dipertahankan</li>
                    <li><strong>Tindakan ini tidak dapat dibatalkan</strong></li>
                  </ul>
                </>
              )}

              {/* Loading indicator */}
              {isResetting && (
                <div
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    gap:            '10px',
                    marginTop:      '16px',
                    padding:        '12px 16px',
                    background:     'var(--sand)',
                    borderRadius:   '8px',
                    fontSize:       '0.88rem',
                    color:          'var(--ink-soft)',
                    fontWeight:     600,
                  }}
                >
                  <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                  Sedang mereset database, harap tunggu...
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer" style={{ padding: '16px 24px' }}>
              {resetResult ? (
                /* After operation — only show Close button */
                <button
                  className={`btn ${resetResult.type === 'success' ? 'btn-soil' : 'btn-outline'}`}
                  onClick={handleResetClose}
                  style={{ marginLeft: 'auto' }}
                >
                  {resetResult.type === 'success' ? '✓ Selesai' : 'Tutup'}
                </button>
              ) : (
                /* Before operation — Batal + Konfirmasi */
                <>
                  <button
                    className="btn btn-outline"
                    onClick={handleResetClose}
                    disabled={isResetting}
                  >
                    Batal
                  </button>
                  <button
                    className="btn btn-red"
                    onClick={handleResetConfirm}
                    disabled={isResetting}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ResetIcon width="14" height="14" />
                    {isResetting ? 'Mereset...' : 'Ya, Reset Sekarang'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminAuthGuard>
  );
}
