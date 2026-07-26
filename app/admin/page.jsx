'use client';

import React from 'react';
import Link from 'next/link';
import { useData } from '../../src/context/DataContext';
import { formatRupiah } from '../../src/utils/formatter';
import { PlusIcon, CheckCircleIcon, XCircleIcon, StarIcon, EyeIcon } from '../../src/components/Icons';

export default function AdminDashboardOverview() {
  const { msmes, products, reviews, toggleReviewStatus, deleteReview } = useData();

  const activeMsmes = msmes.filter((m) => m.status === 'active').length;
  const featuredProducts = products.filter((p) => p.isFeatured).length;
  const approvedReviews = reviews.filter((r) => r.status === 'approved').length;
  const pendingReviews = reviews.filter((r) => r.status === 'pending');

  const recentMsmes = [...msmes].slice(0, 5);
  const recentProducts = [...products].slice(0, 5);

  return (
    <div className="admin-overview">
      {/* STATS OVERVIEW GRID */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-top">
            <span className="stat-icon">🏪</span>
            <span className="stat-badge green">{activeMsmes} Buka</span>
          </div>
          <div className="stat-val">{msmes.length}</div>
          <div className="stat-label">Total UMKM Terdaftar</div>
          <Link href="/admin/umkm" className="stat-link">Kelola UMKM &rarr;</Link>
        </div>

        <div className="admin-stat-card">
          <div className="stat-top">
            <span className="stat-icon">🛍️</span>
            <span className="stat-badge blue">{featuredProducts} Unggulan</span>
          </div>
          <div className="stat-val">{products.length}</div>
          <div className="stat-label">Total Produk Katalog</div>
          <Link href="/admin/products" className="stat-link">Kelola Produk &rarr;</Link>
        </div>

        <div className="admin-stat-card">
          <div className="stat-top">
            <span className="stat-icon">⭐</span>
            <span className="stat-badge amber">{approvedReviews} Disetujui</span>
          </div>
          <div className="stat-val">{reviews.length}</div>
          <div className="stat-label">Total Ulasan Pembeli</div>
          <Link href="/admin/reviews" className="stat-link">Kelola Ulasan &rarr;</Link>
        </div>

        <div className="admin-stat-card highlight">
          <div className="stat-top">
            <span className="stat-icon">⏳</span>
            <span className="stat-badge red">{pendingReviews.length} Perlu Akses</span>
          </div>
          <div className="stat-val">{pendingReviews.length}</div>
          <div className="stat-label">Ulasan Menunggu Moderasi</div>
          <Link href="/admin/reviews" className="stat-link">Moderasi Sekarang &rarr;</Link>
        </div>
      </div>

      {/* QUICK ACTIONS & PENDING REVIEWS */}
      <div className="admin-section-grid">
        {/* PENDING REVIEWS QUICK MODERATION */}
        <div className="panel admin-panel">
          <div className="panel-header">
            <h3>⏳ Moderasi Ulasan Pending ({pendingReviews.length})</h3>
            <Link href="/admin/reviews" className="link-more">Lihat Semua</Link>
          </div>

          {pendingReviews.length === 0 ? (
            <div className="empty-box">
              <p>🎉 Semua ulasan telah dimoderasi! Tidak ada ulasan yang tertunda.</p>
            </div>
          ) : (
            <div className="admin-list-gap">
              {pendingReviews.map((r) => (
                <div key={r.id} className="admin-item-card">
                  <div className="item-header">
                    <div>
                      <b>{r.name}</b> <span className="text-muted">({r.role})</span>
                      <div className="rating-inline">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            style={{
                              color: i < r.rating ? '#FBBF24' : 'var(--line)',
                              width: '12px',
                              height: '12px'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="badge soil">{r.productName || 'Produk UMKM'}</span>
                  </div>
                  <p className="item-quote">"{r.quote}"</p>
                  <div className="item-actions">
                    <button
                      className="btn btn-sm btn-green"
                      onClick={() => toggleReviewStatus(r.id, 'approved')}
                    >
                      <CheckCircleIcon width="14" height="14" /> Setujui
                    </button>
                    <button
                      className="btn btn-sm btn-red"
                      onClick={() => toggleReviewStatus(r.id, 'rejected')}
                    >
                      <XCircleIcon width="14" height="14" /> Tolak
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteReview(r.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK SHORTCUTS & RECENT PRODUCTS */}
        <div className="panel admin-panel">
          <div className="panel-header">
            <h3>⚡ Aksi Cepat Admin</h3>
          </div>
          <div className="quick-buttons-row">
            <Link href="/admin/umkm?action=add" className="btn btn-soil">
              <PlusIcon /> Tambah UMKM Baru
            </Link>
            <Link href="/admin/products?action=add" className="btn btn-outline">
              <PlusIcon /> Tambah Produk Baru
            </Link>
            <Link href="/admin/reviews?action=add" className="btn btn-outline">
              <PlusIcon /> Tambah Review
            </Link>
          </div>

          <div className="panel-header" style={{ marginTop: '24px' }}>
            <h3>🛍️ Ringkasan Produk Terpopuler</h3>
            <Link href="/admin/products" className="link-more">Semua Produk</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama Produk</th>
                  <th>Harga</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <b>{p.name}</b>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{p.msmeName}</div>
                    </td>
                    <td className="mono">{formatRupiah(p.price)}</td>
                    <td>⭐ {p.rating}</td>
                    <td>
                      <span className={`status-pill ${p.status}`}>
                        {p.status === 'active' ? 'Buka' : 'Tutup'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RECENT UMKMS TABLE */}
      <div className="panel admin-panel" style={{ marginTop: '24px' }}>
        <div className="panel-header">
          <h3>🏪 Ringkasan UMKM Terdaftar</h3>
          <Link href="/admin/umkm" className="btn btn-soil btn-sm">
            Kelola Semua UMKM ({msmes.length})
          </Link>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama UMKM</th>
                <th>Pemilik</th>
                <th>Kategori</th>
                <th>Dusun</th>
                <th>Tahun</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentMsmes.map((m) => (
                <tr key={m.id}>
                  <td className="mono">#{m.id}</td>
                  <td>
                    <b>{m.name}</b>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{m.products?.length || 0} produk</div>
                  </td>
                  <td>{m.owner}</td>
                  <td>
                    <span className="badge">{m.cat}</span>
                  </td>
                  <td>{m.dusun}</td>
                  <td className="mono">{m.est}</td>
                  <td>
                    <span className={`status-pill ${m.status}`}>
                      {m.status === 'active' ? 'Aktif' : 'Tutup'}
                    </span>
                  </td>
                  <td>
                    <Link href={`/admin/umkm?edit=${m.id}`} className="btn btn-outline btn-xs">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
