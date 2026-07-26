'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useData } from '../../../src/context/DataContext';
import { formatRupiah } from '../../../src/utils/formatter';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, XIcon, CheckCircleIcon, StarIcon } from '../../../src/components/Icons';

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const { msmes, products, categories, addProduct, updateProduct, deleteProduct } = useData();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [msmeFilter, setMsmeFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const emptyForm = {
    msmeId: msmes[0]?.id || 1,
    name: '',
    desc: '',
    price: '',
    unit: 'pcs',
    rating: 5.0,
    isFeatured: false
  };

  const [formData, setFormData] = useState(emptyForm);

  // Check URL query parameters for action=add or edit=ID
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('edit');

    if (action === 'add') {
      openAddModal();
    } else if (editId) {
      const target = products.find((p) => p.id === editId);
      if (target) {
        openEditModal(target);
      }
    }
  }, [searchParams, products]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...emptyForm,
      msmeId: msmes[0]?.id || 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      msmeId: p.msmeId,
      name: p.name || '',
      desc: p.desc || '',
      price: p.price || 0,
      unit: p.unit || 'pcs',
      rating: p.rating || 5.0,
      isFeatured: !!p.isFeatured
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert('Nama produk dan harga wajib diisi!');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData.msmeId, formData);
    }
    closeModal();
  };

  const handleToggleFeatured = (p) => {
    updateProduct(p.id, { isFeatured: !p.isFeatured });
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
  };

  // Filter logic
  const filteredProducts = products.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.msmeName.toLowerCase().includes(q);
    const matchMsme = msmeFilter === 'all' || p.msmeId === Number(msmeFilter);
    const matchCat = catFilter === 'all' || p.cat === catFilter;
    const matchFeatured =
      featuredFilter === 'all' ||
      (featuredFilter === 'yes' ? p.isFeatured : !p.isFeatured);
    return matchQ && matchMsme && matchCat && matchFeatured;
  });

  return (
    <div className="admin-page">
      {/* TITLE & HEADER BUTTON */}
      <div className="admin-page-header">
        <div>
          <h2>🛍️ Kelola Produk UMKM</h2>
          <p className="sub">Atur barang & jasa unggulan, harga, rating, serta status produk unggulan</p>
        </div>
        <button className="btn btn-soil" onClick={openAddModal}>
          <PlusIcon /> Tambah Produk Baru
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="search-card admin-search-bar" style={{ marginTop: '16px' }}>
        <div className="search-row">
          <div className="search-field" style={{ flex: '2 1 240px' }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Cari produk, deskripsi, atau nama toko..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={msmeFilter} onChange={(e) => setMsmeFilter(e.target.value)}>
            <option value="all">Semua Toko UMKM</option>
            {msmes.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select value={featuredFilter} onChange={(e) => setFeaturedFilter(e.target.value)}>
            <option value="all">Semua Jenis Produk</option>
            <option value="yes">⭐ Produk Unggulan</option>
            <option value="no">Standar</option>
          </select>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="panel admin-panel" style={{ marginTop: '20px' }}>
        <div className="dir-toolbar">
          <div className="result-count">
            Menampilkan <b>{filteredProducts.length}</b> dari <b>{products.length}</b> Produk
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Produk</th>
                <th>Toko UMKM</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Rating</th>
                <th>Unggulan</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-soft)' }}>
                    Tidak ada produk yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="mono" style={{ fontSize: '0.75rem' }}>{p.id}</td>
                    <td>
                      <b style={{ color: 'var(--ink)', display: 'block' }}>{p.name}</b>
                      <span className="text-muted text-ellipsis" style={{ fontSize: '0.76rem', maxWidth: '240px', display: 'block' }}>
                        {p.desc}
                      </span>
                    </td>
                    <td>
                      <b>{p.msmeName}</b>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{p.dusun}</div>
                    </td>
                    <td>
                      <span className="badge">{p.cat}</span>
                    </td>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--soil)' }}>
                      {formatRupiah(p.price)}
                      {p.unit && <span className="text-muted" style={{ fontSize: '0.72rem' }}>/{p.unit}</span>}
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <StarIcon style={{ color: '#FBBF24', width: '13px', height: '13px' }} />
                        <b>{p.rating}</b>
                      </span>
                    </td>
                    <td>
                      <button
                        className={`status-pill btn-toggle ${p.isFeatured ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleFeatured(p)}
                        title="Klik untuk mengubah status unggulan"
                      >
                        {p.isFeatured ? '⭐ Ya' : 'Tidak'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          className="btn btn-outline btn-xs"
                          onClick={() => openEditModal(p)}
                          title="Edit Produk"
                        >
                          <EditIcon width="13" height="13" /> Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-xs"
                          onClick={() => setDeleteConfirmId(p.id)}
                          title="Hapus Produk"
                        >
                          <TrashIcon width="13" height="13" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}</h3>
              <button className="modal-close-btn" onClick={closeModal}>
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                {!editingProduct && (
                  <div className="form-group full-width">
                    <label>Pilih Toko UMKM Penjual *</label>
                    <select
                      value={formData.msmeId}
                      onChange={(e) => setFormData({ ...formData, msmeId: Number(e.target.value) })}
                    >
                      {msmes.map((m) => (
                        <option key={m.id} value={m.id}>{m.name} ({m.owner} - {m.dusun})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group full-width">
                  <label>Nama Produk *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kopi Robusta Sangrai 250g"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Harga Produk (Rp) *</label>
                  <input
                    type="number"
                    required
                    placeholder="35000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Satuan Satuan</label>
                  <input
                    type="text"
                    placeholder="pack / pcs / bungkus / lembar"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Rating Produk (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Tampilkan sebagai Produk Unggulan?</label>
                  <select
                    value={formData.isFeatured ? 'yes' : 'no'}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.value === 'yes' })}
                  >
                    <option value="no">Tidak (Produk Standar)</option>
                    <option value="yes">⭐ Ya (Produk Unggulan)</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Deskripsi Singkat Produk</label>
                  <textarea
                    rows="3"
                    placeholder="Penjelasan keunggulan, bahan baku, rasa, atau spesifikasi..."
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className="btn btn-soil">
                  <CheckCircleIcon /> {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-container modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚠️ Hapus Produk</h3>
              <button className="modal-close-btn" onClick={() => setDeleteConfirmId(null)}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '20px' }}>
              <p>Apakah Anda yakin ingin menghapus produk ini dari katalog?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setDeleteConfirmId(null)}>
                Batal
              </button>
              <button className="btn btn-red" onClick={() => handleDelete(deleteConfirmId)}>
                <TrashIcon /> Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="panel"><p>Memuat katalog produk...</p></div>}>
      <AdminProductsContent />
    </Suspense>
  );
}
