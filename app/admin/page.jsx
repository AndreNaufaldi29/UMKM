'use client';

import React from 'react';
import Link from 'next/link';
import { useData } from '../../src/context/DataContext';
import { formatRupiah } from '../../src/utils/formatter';
import { PlusIcon } from '../../src/components/Icons';

export default function AdminDashboardOverview() {
  const { msmes, products } = useData();

  const activeMsmes = msmes.filter((m) => m.status === 'active').length;
  const featuredProducts = products.filter((p) => p.isFeatured).length;

  const recentMsmes = [...msmes].slice(0, 5);
  const recentProducts = [...products].slice(0, 5);

  return (
    <div className="admin-overview">
      {/* STATS OVERVIEW GRID */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
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
      </div>

      {/* QUICK ACTIONS & RECENT PRODUCTS */}
      <div className="panel admin-panel" style={{ marginTop: '24px' }}>
        <div className="panel-header">
          <h3>⚡ Aksi Cepat Admin</h3>
        </div>
        <div className="quick-buttons-row">
          <Link href="/admin/umkm?action=add" className="btn btn-soil">
            <PlusIcon /> Tambah UMKM Baru
          </Link>
          <Link href="/admin/products?action=add" className="btn btn-product">
            <PlusIcon /> Tambah Produk Baru
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
                  <td>
                    <span className={'status-pill ' + (p.status || '')}>
                      {p.status === 'active' ? 'Buka' : 'Tutup'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  <td className="mono">{m.est}</td>
                  <td>
                    <span className={'status-pill ' + (m.status || '')}>
                      {m.status === 'active' ? 'Aktif' : 'Tutup'}
                    </span>
                  </td>
                  <td>
                    <Link href={'/admin/umkm?edit=' + m.id} className="btn btn-outline btn-xs">
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