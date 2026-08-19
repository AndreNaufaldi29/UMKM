'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useData } from '../../../src/context/DataContext';
import { withBasePath } from '../../../src/utils/basePath';
import { CategoryIcon } from '../../../src/components/Icons';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, XIcon, CheckCircleIcon, PinIcon } from '../../../src/components/Icons';

function AdminUMKMContent() {
  const searchParams = useSearchParams();
  const { msmes, categories, addMsme, updateMsme, deleteMsme } = useData();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMsme, setEditingMsme] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [urlInput, setUrlInput] = useState('');

  // Form State
  const emptyForm = {
    name: '',
    owner: '',
    cat: categories[0] || 'Kuliner',
    est: new Date().getFullYear(),
    status: 'active',
    addr: '',
    hours: '08.00 – 17.00 setiap hari',
    desc: '',
    history: '',
    latitude: '',
    longitude: '',
    imageUrl: '',
    wa: '',
    phone: '',
    email: '',
    web: '',
    fb: '',
    ig: '',
    tiktok: '',
    certs: ''
  };

  const [formData, setFormData] = useState(emptyForm);

  // Open modal if action=add or edit=ID in URL query
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('edit');

    if (action === 'add') {
      openAddModal();
    } else if (editId) {
      const target = msmes.find((m) => m.id === Number(editId));
      if (target) {
        openEditModal(target);
      }
    }
  }, [searchParams]);

  const openAddModal = () => {
    setEditingMsme(null);
    setFormData(emptyForm);
    setUrlInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (m) => {
    setEditingMsme(m);
    setFormData({
      name: m.name || '',
      owner: m.owner || '',
      cat: m.cat || categories[0],
      est: m.est || new Date().getFullYear(),
      status: m.status || 'active',
      addr: m.addr || '',
      hours: m.hours || '',
      desc: m.desc || '',
      history: m.history || '',
      latitude: m.latitude !== null && m.latitude !== undefined ? m.latitude : '',
      longitude: m.longitude !== null && m.longitude !== undefined ? m.longitude : '',
      imageUrl: m.imageUrl || '',
      wa: m.wa || '',
      phone: m.phone || '',
      email: m.email || '',
      web: m.web || '',
      fb: m.fb || '',
      ig: m.ig || '',
      tiktok: m.tiktok || '',
      certs: Array.isArray(m.certs) ? m.certs.join('\n') : m.certs || ''
    });
    setUrlInput(m.imageUrl || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMsme(null);
    setUrlInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.owner.trim()) {
      alert('Nama UMKM dan Nama Pemilik wajib diisi!');
      return;
    }

    if (editingMsme) {
      updateMsme(editingMsme.id, formData);
    } else {
      addMsme(formData);
    }
    closeModal();
  };

  const handleToggleStatus = (m) => {
    const nextStatus = m.status === 'active' ? 'inactive' : 'active';
    updateMsme(m.id, { status: nextStatus });
  };

  const handleDelete = (id) => {
    deleteMsme(id);
    setDeleteConfirmId(null);
  };

  const handleBannerFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSetUrlBanner = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({ ...prev, imageUrl: trimmed }));
  };

  const handleRemoveBanner = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    setUrlInput('');
  };

  const getPreviewSrc = (src) => {
    if (!src) return '';
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
    return withBasePath(src);
  };

  // Filtering Logic
  const filteredMsmes = msmes.filter((m) => {
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.owner.toLowerCase().includes(q) ||
      m.addr.toLowerCase().includes(q);
    const matchCat = catFilter === 'all' || m.cat === catFilter;
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchQ && matchCat && matchStatus;
  });

  return (
    <div className="admin-page">
      {/* TITLE & HEADER BUTTON */}
      <div className="admin-page-header">
        <div>
          <h2>🏪 Kelola Data UMKM Desa</h2>
          <p className="sub">Tambah, ubah profil, atau sesuaikan status operasional usaha lokal desa</p>
        </div>
        <button className="btn btn-soil" onClick={openAddModal}>
          <PlusIcon /> Tambah UMKM Baru
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="search-card admin-search-bar" style={{ marginTop: '16px' }}>
        <div className="search-row">
          <div className="search-field" style={{ flex: '2 1 240px' }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Cari nama UMKM, pemilik, atau alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Semua Status</option>
            <option value="active">Aktif Beroperasi</option>
            <option value="inactive">Tutup Sementara</option>
          </select>

          {(search || catFilter !== 'all' || statusFilter !== 'all') && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setSearch('');
                setCatFilter('all');
                setStatusFilter('all');
              }}
              title="Reset Filter"
              style={{ height: '42px', padding: '0 14px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <XIcon width="14" height="14" /> Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="panel admin-panel" style={{ marginTop: '20px' }}>
        <div className="dir-toolbar">
          <div className="result-count">
            Menampilkan <b>{filteredMsmes.length}</b> dari <b>{msmes.length}</b> UMKM
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '64px' }}>Foto</th>
                <th>ID</th>
                <th>Nama UMKM & Pemilik</th>
                <th>Kategori</th>
                <th>Alamat</th>
                <th>Tahun</th>
                <th>Produk</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMsmes.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-soft)' }}>
                    Tidak ada data UMKM yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredMsmes.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {m.imageUrl ? (
                          <img
                            src={getPreviewSrc(m.imageUrl)}
                            alt={m.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <CategoryIcon cat={m.cat} style={{ color: 'var(--forest)' }} />
                        )}
                      </div>
                    </td>
                    <td className="mono">#{m.id}</td>
                    <td>
                      <b style={{ color: 'var(--ink)', display: 'block' }}>{m.name}</b>
                      <span className="text-muted" style={{ fontSize: '0.78rem' }}>Pemilik: {m.owner}</span>
                    </td>
                    <td>
                      <span className="badge">{m.cat}</span>
                    </td>
                    <td>
                      <div className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <PinIcon width="10" height="10" /> {m.addr}
                      </div>
                    </td>
                    <td className="mono">{m.est}</td>
                    <td>
                      <span className="badge sky">{m.products?.length || 0} Produk</span>
                    </td>
                    <td>
                      <button
                        className={`status-pill btn-toggle ${m.status}`}
                        onClick={() => handleToggleStatus(m)}
                        title="Klik untuk mengubah status"
                      >
                        {m.status === 'active' ? '✓ Aktif' : '✕ Tutup'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          className="btn btn-outline btn-xs"
                          onClick={() => openEditModal(m)}
                          title="Edit UMKM"
                        >
                          <EditIcon width="13" height="13" /> Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-xs"
                          onClick={() => setDeleteConfirmId(m.id)}
                          title="Hapus UMKM"
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
          <div className="modal-container" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingMsme ? '✏️ Edit Data UMKM' : '➕ Tambah UMKM Baru'}</h3>
              <button className="modal-close-btn" onClick={closeModal}>
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nama UMKM *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kopi Sunyi Kaki Gunung"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Nama Pemilik Usaha *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pak Yono"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Kategori Usaha</label>
                  <select
                    value={formData.cat}
                    onChange={(e) => setFormData({ ...formData, cat: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tahun Berdiri</label>
                  <input
                    type="number"
                    placeholder="2015"
                    value={formData.est}
                    onChange={(e) => setFormData({ ...formData, est: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Status Operasional</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">✓ Aktif Beroperasi</option>
                    <option value="inactive">✕ Tutup Sementara</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Alamat Lengkap Usaha</label>
                  <input
                    type="text"
                    placeholder="Jl. Raya Desa No. 12, RT 02/RW 01"
                    value={formData.addr}
                    onChange={(e) => setFormData({ ...formData, addr: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Jam Operasional Usaha</label>
                  <input
                    type="text"
                    placeholder="07.00 – 20.00 setiap hari"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Deskripsi Profil Usaha</label>
                  <textarea
                    rows="3"
                    placeholder="Tuliskan deskripsi keunggulan dan cerita usaha..."
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Sejarah Singkat Usaha</label>
                  <textarea
                    rows="3"
                    placeholder="Tuliskan latar belakang berdiri dan sejarah perkembangan usaha..."
                    value={formData.history}
                    onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Koordinat Latitude (Gps Lintang)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="-7.250400"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Koordinat Longitude (Gps Bujur)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="110.150200"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  />
                </div>
              </div>

              {/* BANNER IMAGE MANAGEMENT SECTION */}
              <div style={{ marginTop: '20px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)' }}>
                    🖼️ Kelola Foto Banner UMKM
                  </label>
                  {formData.imageUrl && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--forest)', fontWeight: 600 }}>
                      ✓ Banner Terpasang
                    </span>
                  )}
                </div>

                <div style={{ background: 'var(--soil-soft, #fdf8f4)', border: '1px solid rgba(181, 101, 29, 0.2)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--ink-soft)', marginBottom: '14px', lineHeight: '1.4' }}>
                  💡 <b>Informasi:</b> Foto banner ini akan ditampilkan di halaman kartu UMKM beranda, halaman direktori, serta bagian atas profil UMKM.
                </div>

                {/* DUAL INPUT METHODS */}
                <div className="admin-image-upload-grid">
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: '4px' }}>
                      1. Unggah File Banner (Lokal)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileUpload}
                      style={{ fontSize: '0.82rem', width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: '4px' }}>
                      2. Input via URL Gambar
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="https://... atau /images/umkm-1.jpg"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSetUrlBanner(); } }}
                        style={{ fontSize: '0.82rem', padding: '6px 10px', flex: 1 }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleSetUrlBanner}
                        style={{ padding: '6px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                      >
                        Set URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* BANNER PREVIEW CARD */}
                {formData.imageUrl ? (
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '2px solid var(--forest, #1E4B3B)',
                      boxShadow: '0 3px 10px rgba(30, 75, 59, 0.2)',
                      background: '#fff',
                      marginTop: '10px'
                    }}
                  >
                    <div style={{ position: 'relative', height: '140px', width: '100%', background: '#f8f9fa' }}>
                      <img
                        src={getPreviewSrc(formData.imageUrl)}
                        alt="Preview Banner UMKM"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/600x200?text=Banner+Image+Error'; }}
                      />

                      <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--forest, #1E4B3B)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.02em', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        ⭐ BANNER AKTIF
                      </span>

                      <button
                        type="button"
                        onClick={handleRemoveBanner}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                        title="Hapus foto banner ini"
                      >
                        ✕ Hapus Banner
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px', border: '2px dashed var(--line)', borderRadius: '8px', color: 'var(--ink-soft)', fontSize: '0.84rem' }}>
                    Belum ada banner foto yang dipilih. Unggah file gambar atau masukkan URL di atas.
                  </div>
                )}
              </div>

              {/* CONTACT & SOCIAL MEDIA SECTION */}
              <div style={{ marginTop: '20px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '12px' }}>
                  📞 Kontak & Media Sosial Usaha
                </h4>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Nomor WhatsApp (dengan kode negara)</label>
                    <input
                      type="text"
                      placeholder="6281234567801"
                      value={formData.wa}
                      onChange={(e) => setFormData({ ...formData, wa: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Nomor Telepon Kantor / Toko</label>
                    <input
                      type="text"
                      placeholder="0274-556677"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Usaha</label>
                    <input
                      type="email"
                      placeholder="kontak@desasukamaju.id"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="text"
                      placeholder="usahakita.id"
                      value={formData.web}
                      onChange={(e) => setFormData({ ...formData, web: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Instagram Username</label>
                    <input
                      type="text"
                      placeholder="username.ig"
                      value={formData.ig}
                      onChange={(e) => setFormData({ ...formData, ig: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>TikTok Username</label>
                    <input
                      type="text"
                      placeholder="username_tiktok"
                      value={formData.tiktok}
                      onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Sertifikasi & Izinkan (1 per baris)</label>
                    <textarea
                      rows="2"
                      placeholder="Sertifikat Halal MUI&#10;Izin Usaha Mikro Kecil (IUMK)"
                      value={formData.certs}
                      onChange={(e) => setFormData({ ...formData, certs: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className="btn btn-soil">
                  <CheckCircleIcon /> {editingMsme ? 'Simpan Perubahan' : 'Tambah UMKM'}
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
              <h3>⚠️ Hapus Data UMKM</h3>
              <button className="modal-close-btn" onClick={() => setDeleteConfirmId(null)}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '20px' }}>
              <p>Apakah Anda yakin ingin menghapus UMKM ini? Tindakan ini tidak dapat dibatalkan.</p>
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

export default function AdminUMKMPage() {
  return (
    <Suspense fallback={<div className="panel"><p>Memuat data UMKM...</p></div>}>
      <AdminUMKMContent />
    </Suspense>
  );
}