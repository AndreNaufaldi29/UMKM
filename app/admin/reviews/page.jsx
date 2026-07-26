'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useData } from '../../../src/context/DataContext';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, XIcon, CheckCircleIcon, XCircleIcon, StarIcon } from '../../../src/components/Icons';

function AdminReviewsContent() {
  const searchParams = useSearchParams();
  const { msmes, reviews, addReview, updateReview, toggleReviewStatus, deleteReview } = useData();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const emptyForm = {
    name: '',
    role: 'Pembeli Terverifikasi',
    rating: 5,
    quote: '',
    msmeId: msmes[0]?.id || 1,
    productName: 'Kopi Robusta Sangrai',
    status: 'approved'
  };

  const [formData, setFormData] = useState(emptyForm);

  // Check URL query parameters for action=add or edit=ID
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('edit');

    if (action === 'add') {
      openAddModal();
    } else if (editId) {
      const target = reviews.find((r) => r.id === Number(editId));
      if (target) {
        openEditModal(target);
      }
    }
  }, [searchParams, reviews]);

  const openAddModal = () => {
    setEditingReview(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (r) => {
    setEditingReview(r);
    setFormData({
      name: r.name || '',
      role: r.role || '',
      rating: r.rating || 5,
      quote: r.quote || '',
      msmeId: r.msmeId || (msmes[0]?.id || 1),
      productName: r.productName || '',
      status: r.status || 'approved'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quote.trim()) {
      alert('Nama pengulas dan isi ulasan wajib diisi!');
      return;
    }

    if (editingReview) {
      updateReview(editingReview.id, formData);
    } else {
      addReview(formData);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    deleteReview(id);
    setDeleteConfirmId(null);
  };

  // Filter Logic
  const filteredReviews = reviews.filter((r) => {
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q) ||
      r.quote.toLowerCase().includes(q) ||
      (r.productName && r.productName.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchRating = ratingFilter === 'all' || Math.floor(r.rating) === Number(ratingFilter);
    return matchQ && matchStatus && matchRating;
  });

  const getStatusBadge = (st) => {
    switch (st) {
      case 'approved':
        return <span className="status-pill active">✓ Disetujui</span>;
      case 'pending':
        return <span className="status-pill pending">⏳ Moderasi (Pending)</span>;
      case 'rejected':
        return <span className="status-pill inactive">✕ Ditolak</span>;
      default:
        return <span className="status-pill">{st}</span>;
    }
  };

  return (
    <div className="admin-page">
      {/* TITLE & HEADER BUTTON */}
      <div className="admin-page-header">
        <div>
          <h2>⭐ Kelola & Moderasi Review Ulasan</h2>
          <p className="sub">Tinjau testimoni pembeli, beri persetujuan publik, atau tambah testimoni pelanggan baru</p>
        </div>
        <button className="btn btn-soil" onClick={openAddModal}>
          <PlusIcon /> Tambah Ulasan Baru
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="search-card admin-search-bar" style={{ marginTop: '16px' }}>
        <div className="search-row">
          <div className="search-field" style={{ flex: '2 1 240px' }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Cari nama pengulas, produk, atau isi ulasan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Semua Status Moderasi</option>
            <option value="approved">Disetujui (Tampil di Situs)</option>
            <option value="pending">⏳ Pending (Menunggu Moderasi)</option>
            <option value="rejected">✕ Ditolak</option>
          </select>

          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
            <option value="all">Semua Rating</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
            <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
            <option value="3">⭐⭐⭐ (3 Bintang)</option>
          </select>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="panel admin-panel" style={{ marginTop: '20px' }}>
        <div className="dir-toolbar">
          <div className="result-count">
            Menampilkan <b>{filteredReviews.length}</b> dari <b>{reviews.length}</b> Ulasan
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pengulas</th>
                <th>Produk / UMKM</th>
                <th>Isi Ulasan & Rating</th>
                <th>Tanggal</th>
                <th>Status Moderasi</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-soft)' }}>
                    Tidak ada ulasan yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.78rem' }}>{r.avatar || 'U'}</div>
                        <div>
                          <b style={{ color: 'var(--ink)', display: 'block' }}>{r.name}</b>
                          <span className="text-muted" style={{ fontSize: '0.76rem' }}>{r.role}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <b>{r.productName || 'Produk UMKM'}</b>
                    </td>
                    <td style={{ maxWidth: '320px' }}>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
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
                      <p style={{ fontSize: '0.84rem', color: 'var(--ink)', fontStyle: 'italic', margin: 0 }}>
                        "{r.quote}"
                      </p>
                    </td>
                    <td className="mono" style={{ fontSize: '0.78rem' }}>{r.date || 'Terkini'}</td>
                    <td>{getStatusBadge(r.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {r.status !== 'approved' && (
                          <button
                            className="btn btn-sm btn-green"
                            onClick={() => toggleReviewStatus(r.id, 'approved')}
                            title="Setujui agar tampil di situs publik"
                          >
                            Setujui
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button
                            className="btn btn-sm btn-red"
                            onClick={() => toggleReviewStatus(r.id, 'rejected')}
                            title="Tolak ulasan"
                          >
                            Tolak
                          </button>
                        )}
                        <button
                          className="btn btn-outline btn-xs"
                          onClick={() => openEditModal(r)}
                          title="Edit Review"
                        >
                          <EditIcon width="13" height="13" /> Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-xs"
                          onClick={() => setDeleteConfirmId(r.id)}
                          title="Hapus Review"
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
              <h3>{editingReview ? '✏️ Edit Ulasan / Review' : '➕ Tambah Ulasan Baru'}</h3>
              <button className="modal-close-btn" onClick={closeModal}>
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nama Pembeli / Pengulas *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Status / Role Pembeli</label>
                  <input
                    type="text"
                    placeholder="Contoh: Wisatawan, Jakarta"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Produk / UMKM Terkait</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kopi Robusta Sangrai"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Pilih Toko UMKM</label>
                  <select
                    value={formData.msmeId}
                    onChange={(e) => setFormData({ ...formData, msmeId: Number(e.target.value) })}
                  >
                    {msmes.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Rating (1 - 5 Bintang)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
                    <option value={3}>⭐⭐⭐ (3 Bintang)</option>
                    <option value={2}>⭐⭐ (2 Bintang)</option>
                    <option value={1}>⭐ (1 Bintang)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status Moderasi</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="approved">✓ Disetujui (Tampil di Beranda)</option>
                    <option value="pending">⏳ Pending (Menunggu Persetujuan)</option>
                    <option value="rejected">✕ Ditolak</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Isi Testimoni / Ulasan *</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Tuliskan ulasan jujur atau masukan mengenai produk..."
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className="btn btn-soil">
                  <CheckCircleIcon /> {editingReview ? 'Simpan Perubahan' : 'Tambah Ulasan'}
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
              <h3>⚠️ Hapus Review</h3>
              <button className="modal-close-btn" onClick={() => setDeleteConfirmId(null)}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '20px' }}>
              <p>Apakah Anda yakin ingin menghapus ulasan ini secara permanen?</p>
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

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<div className="panel"><p>Memuat review...</p></div>}>
      <AdminReviewsContent />
    </Suspense>
  );
}
