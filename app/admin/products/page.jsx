'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useData } from '../../../src/context/DataContext';
import { formatRupiah } from '../../../src/utils/formatter';
import { withBasePath } from '../../../src/utils/basePath';
import { ProductSVG } from '../../../src/components/DynamicSVGs';
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
  const [urlInput, setUrlInput] = useState('');

  // Form State
  const emptyForm = {
    msmeId: msmes[0]?.id || 1,
    name: '',
    desc: '',
    price: '',
    unit: 'pcs',
    rating: 5.0,
    isFeatured: false,
    images: [],
    imagePreviews: []
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
  }, [searchParams]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...emptyForm,
      msmeId: msmes[0]?.id || 1
    });
    setUrlInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    let existingImages = [];
    if (Array.isArray(p.images) && p.images.length > 0) {
      existingImages = p.images;
    } else if (p.imageUrl) {
      const trimmed = p.imageUrl.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          existingImages = JSON.parse(trimmed);
        } catch (e) { }
      }
      if (existingImages.length === 0) {
        existingImages = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    setFormData({
      msmeId: p.msmeId,
      name: p.name || '',
      desc: p.desc || '',
      price: p.price || 0,
      unit: p.unit || 'pcs',
      rating: p.rating || 5.0,
      isFeatured: !!p.isFeatured,
      images: existingImages,
      imagePreviews: existingImages
    });
    setUrlInput('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setUrlInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert('Nama produk dan harga wajib diisi!');
      return;
    }

    const payload = {
      ...formData,
      images: formData.images || []
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(formData.msmeId, payload);
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews = [];
    let readCount = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        newPreviews.push(reader.result);
        readCount++;
        if (readCount === files.length) {
          setFormData((prev) => {
            const updated = [...(prev.images || []), ...newPreviews];
            return {
              ...prev,
              images: updated,
              imagePreviews: updated
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddUrlImage = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setFormData((prev) => {
      const updated = [...(prev.images || []), trimmed];
      return {
        ...prev,
        images: updated,
        imagePreviews: updated
      };
    });
    setUrlInput('');
  };

  const removeImagePreview = (index) => {
    setFormData((prev) => {
      const updated = (prev.images || []).filter((_, i) => i !== index);
      return {
        ...prev,
        images: updated,
        imagePreviews: updated
      };
    });
  };

  const setAsPrimaryImage = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const list = [...(prev.images || [])];
      const item = list.splice(index, 1)[0];
      list.unshift(item);
      return {
        ...prev,
        images: list,
        imagePreviews: list
      };
    });
  };

  const moveImage = (index, direction) => {
    setFormData((prev) => {
      const list = [...(prev.images || [])];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return {
        ...prev,
        images: list,
        imagePreviews: list
      };
    });
  };

  const getPreviewSrc = (src) => {
    if (!src) return '';
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
    return withBasePath(src);
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
          <p className="sub">Atur barang & jasa unggulan, harga, rating, galeri foto produk, serta status produk unggulan</p>
        </div>
        <button className="btn btn-product" onClick={openAddModal}>
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
                <th style={{ width: '64px' }}>Foto</th>
                <th>ID</th>
                <th>Nama Produk</th>
                <th>Toko UMKM</th>
                <th>Kategori</th>
                <th>Harga</th>
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
                filteredProducts.map((p) => {
                  let imgList = [];
                  if (Array.isArray(p.images) && p.images.length > 0) {
                    imgList = p.images;
                  } else if (p.imageUrl) {
                    const trimmed = p.imageUrl.trim();
                    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                      try { imgList = JSON.parse(trimmed); } catch (e) { }
                    }
                    if (imgList.length === 0) {
                      imgList = trimmed.split(',').map(s => s.trim()).filter(Boolean);
                    }
                  }
                  const coverImg = imgList[0];

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--line)', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {coverImg ? (
                            <img
                              src={getPreviewSrc(coverImg)}
                              alt={p.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <ProductSVG cat={p.cat} seed={p.name.length} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                          {imgList.length > 1 && (
                            <span style={{ position: 'absolute', bottom: '2px', right: '2px', background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '0.62rem', padding: '1px 4px', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>
                              {imgList.length}
                            </span>
                          )}
                        </div>
                      </td>
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
                  );
                })
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
                  <label>Satuan Produk</label>
                  <input
                    type="text"
                    placeholder="pack / pcs / bungkus / lembar"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
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

              {/* IMAGE MANAGEMENT SECTION */}
              <div style={{ marginTop: '20px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)' }}>
                    🖼️ Galeri & Kelola Foto Produk
                  </label>
                  <span style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
                    Total: <b>{formData.images?.length || 0}</b> Foto
                  </span>
                </div>

                <div style={{ background: 'var(--soil-soft, #fdf8f4)', border: '1px solid rgba(181, 101, 29, 0.2)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--ink-soft)', marginBottom: '14px', lineHeight: '1.4' }}>
                  💡 <b>Informasi:</b> Foto di urutan pertama (paling kiri/atas) akan digunakan sebagai <b>Foto Utama (Sampul)</b> produk pada katalog. Anda dapat mengubah urutan foto atau menetapkan foto utama menggunakan tombol di bawah.
                </div>

                {/* DUAL INPUT METHODS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: '4px' }}>
                      1. Unggah File Foto (Lokal)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      style={{ fontSize: '0.82rem', width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: '4px' }}>
                      2. Tambah via URL Gambar
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="https://... atau /uploads/foto.jpg"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrlImage(); } }}
                        style={{ fontSize: '0.82rem', padding: '6px 10px', flex: 1 }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleAddUrlImage}
                        style={{ padding: '6px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>
                </div>

                {/* IMAGES GRID & CARDS */}
                {formData.images && formData.images.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '12px', marginTop: '10px' }}>
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'relative',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: idx === 0 ? '2px solid var(--forest, #1E4B3B)' : '1px solid var(--line)',
                          boxShadow: idx === 0 ? '0 3px 10px rgba(30, 75, 59, 0.25)' : 'none',
                          background: '#fff',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        {/* IMAGE PREVIEW AREA */}
                        <div style={{ position: 'relative', height: '95px', width: '100%', background: '#f8f9fa' }}>
                          <img
                            src={getPreviewSrc(img)}
                            alt={`Foto ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error'; }}
                          />

                          {/* COVER BADGE OR INDEX BADGE */}
                          {idx === 0 ? (
                            <span style={{ position: 'absolute', top: '4px', left: '4px', background: 'var(--forest, #1E4B3B)', color: '#fff', fontSize: '0.66rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.02em', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                              ⭐ UTAMA
                            </span>
                          ) : (
                            <span style={{ position: 'absolute', top: '4px', left: '4px', background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.66rem', fontWeight: 600, padding: '2px 5px', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>
                              #{idx + 1}
                            </span>
                          )}

                          {/* DELETE BUTTON */}
                          <button
                            type="button"
                            onClick={() => removeImagePreview(idx)}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              background: 'rgba(239, 68, 68, 0.9)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                            title="Hapus foto ini"
                          >
                            ✕
                          </button>
                        </div>

                        {/* ACTION TOOLBAR UNDER IMAGE */}
                        <div style={{ padding: '6px 8px', background: '#fafafa', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveImage(idx, -1)}
                              style={{ padding: '2px 6px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid var(--line)', background: idx === 0 ? '#eee' : '#fff', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                              title="Geser ke kiri / naikkan urutan"
                            >
                              ⬅️
                            </button>
                            <button
                              type="button"
                              disabled={idx === formData.images.length - 1}
                              onClick={() => moveImage(idx, 1)}
                              style={{ padding: '2px 6px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid var(--line)', background: idx === formData.images.length - 1 ? '#eee' : '#fff', cursor: idx === formData.images.length - 1 ? 'not-allowed' : 'pointer' }}
                              title="Geser ke kanan / turunkan urutan"
                            >
                              ➡️
                            </button>
                          </div>

                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => setAsPrimaryImage(idx)}
                              style={{ padding: '2px 6px', fontSize: '0.68rem', fontWeight: 600, color: 'var(--forest, #1E4B3B)', borderRadius: '4px', border: '1px solid var(--forest, #1E4B3B)', background: '#fff', cursor: 'pointer' }}
                              title="Jadikan Foto Utama"
                            >
                              ⭐ Utama
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', border: '2px dashed var(--line)', borderRadius: '8px', color: 'var(--ink-soft)', fontSize: '0.84rem' }}>
                    Belum ada foto yang ditambahkan. Unggah file foto atau masukkan URL gambar di atas.
                  </div>
                )}
              </div>

              <div className="modal-footer" style={{ marginTop: '24px' }}>
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