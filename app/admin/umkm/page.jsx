'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useData } from '../../../src/context/DataContext';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, XIcon, CheckCircleIcon, PinIcon } from '../../../src/components/Icons';

function AdminUMKMContent() {
  const searchParams = useSearchParams();
  const { msmes, categories, dusunList, addMsme, updateMsme, deleteMsme } = useData();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [dusunFilter, setDusunFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMsme, setEditingMsme] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const emptyForm = {
    name: '',
    owner: '',
    cat: categories[0] || 'Kuliner',
    dusun: dusunList[0] || 'Dusun Mekar',
    est: new Date().getFullYear(),
    status: 'active',
    addr: '',
    hours: '08.00 – 17.00 setiap hari',
    desc: '',
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
  }, [searchParams, msmes]);

  const openAddModal = () => {
    setEditingMsme(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (m) => {
    setEditingMsme(m);
    setFormData({
      name: m.name || '',
      owner: m.owner || '',
      cat: m.cat || categories[0],
      dusun: m.dusun || dusunList[0],
      est: m.est || new Date().getFullYear(),
      status: m.status || 'active',
      addr: m.addr || '',
      hours: m.hours || '',
      desc: m.desc || '',
      wa: m.wa || '',
      phone: m.phone || '',
      email: m.email || '',
      web: m.web || '',
      fb: m.fb || '',
      ig: m.ig || '',
      tiktok: m.tiktok || '',
      certs: Array.isArray(m.certs) ? m.certs.join('\n') : m.certs || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMsme(null);
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

  // Filtering Logic
  const filteredMsmes = msmes.filter((m) => {
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.owner.toLowerCase().includes(q) ||
      m.addr.toLowerCase().includes(q);
    const matchCat = catFilter === 'all' || m.cat === catFilter;
    const matchDusun = dusunFilter === 'all' || m.dusun === dusunFilter;
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchQ && matchCat && matchDusun && matchStatus;
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

          <select value={dusunFilter} onChange={(e) => setDusunFilter(e.target.value)}>
            <option value="all">Semua Dusun</option>
            {dusunList.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Semua Status</option>
            <option value="active">Aktif Beroperasi</option>
            <option value="inactive">Tutup Sementara</option>
          </select>
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
                <th>ID</th>
                <th>Nama UMKM & Pemilik</th>
                <th>Kategori</th>
                <th>Dusun & Alamat</th>
                <th>Tahun</th>
                <th>Produk</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMsmes.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-soft)' }}>
                    Tidak ada data UMKM yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredMsmes.map((m) => (
                  <tr key={m.id}>
                    <td className="mono">#{m.id}</td>
                    <td>
                      <b style={{ color: 'var(--ink)', display: 'block' }}>{m.name}</b>
                      <span className="text-muted" style={{ fontSize: '0.78rem' }}>Pemilik: {m.owner}</span>
                    </td>
                    <td>
                      <span className="badge">{m.cat}</span>
                    </td>
                    <td>
                      <b>{m.dusun}</b>
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
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
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
                  <label>Nama Pemilik *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Wardi Susanto"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Kategori Sektor</label>
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
                  <label>Lokasi Dusun</label>
                  <select
                    value={formData.dusun}
                    onChange={(e) => setFormData({ ...formData, dusun: e.target.value })}
                  >
                    {dusunList.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tahun Berdiri</label>
                  <input
                    type="number"
                    placeholder="2019"
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
                    <option value="active">Aktif Beroperasi</option>
                    <option value="inactive">Tutup Sementara</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Alamat Lengkap Usaha</label>
                  <input
                    type="text"
                    placeholder="Jl. Kebun Kopi No. 12, Dusun Mekar"
                    value={formData.addr}
                    onChange={(e) => setFormData({ ...formData, addr: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Jam Operasional</label>
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

              <div className="modal-footer">
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
