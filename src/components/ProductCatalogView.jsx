'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES } from '../data/msmes';
import ProductCard from './ProductCard';
import { SearchIcon, EmptyIcon, CategoryIcon } from './Icons';

const PER_PAGE = 8;

export default function ProductCatalogView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Load initial state from URL query parameters
  const initialQ = searchParams.get('q') || '';
  const initialCat = searchParams.get('cat') || 'all';
  const initialSort = searchParams.get('sort') || 'rating';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // States
  const [query, setQuery] = useState(initialQ);
  const [cat, setCat] = useState(initialCat);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  // Sync state if query parameters change
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setCat(searchParams.get('cat') || 'all');
    setSort(searchParams.get('sort') || 'rating');
    setPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="wrap section">
        <p>Memuat katalog produk...</p>
      </div>
    );
  }

  // Update URL parameters when state changes
  const updateUrl = (newQ, newCat, newDusun, newSort, newPage) => {
    const params = new URLSearchParams();
    if (newQ.trim()) params.set('q', newQ.trim());
    if (newCat !== 'all') params.set('cat', newCat);
    if (newDusun !== 'all') params.set('dusun', newDusun);
    if (newSort !== 'rating') params.set('sort', newSort);
    if (newPage > 1) params.set('page', newPage.toString());

    const urlString = params.toString() ? `/products?${params.toString()}` : '/products';
    router.push(urlString, { scroll: false });
  };

  // Handler functions
  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setPage(1);
    updateUrl(val, cat, dusun, sort, 1);
  };

  const handleCatChange = (newCat) => {
    setCat(newCat);
    setPage(1);
    updateUrl(query, newCat, dusun, sort, 1);
  };

  

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
    updateUrl(query, cat, dusun, newSort, 1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper counts
  const getCatCount = (c) => PRODUCTS.filter((p) => (c === 'all' ? true : p.cat === c)).length;

  // Filter & sort logic
  const filteredList = PRODUCTS.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.msmeName.toLowerCase().includes(q);
    const matchCat = cat === 'all' || p.cat === cat;
    return matchQ && matchCat;
  });

  const sortedList = [...filteredList];
  if (sort === 'price_asc') {
    sortedList.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    sortedList.sort((a, b) => b.price - a.price);
  } else if (sort === 'popular') {
    sortedList.sort((a, b) => b.views - a.views);
  } else {
    // rating
    sortedList.sort((a, b) => b.rating - a.rating);
  }

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(sortedList.length / PER_PAGE));
  const currentPage = page > totalPages ? totalPages : page;
  const pageItems = sortedList.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <main>
      {/* BREADCRUMB */}
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Beranda</Link>
          <span className="sep">/</span>
          <span className="current">Katalog Produk</span>
        </div>
      </div>

      <div className="wrap section" style={{ paddingTop: '8px' }}>
        <div className="section-head">
          <div>
            <h2>Katalog Produk UMKM</h2>
            <div className="sub">{PRODUCTS.length} produk unggulan dari UMKM Desa Sukamaju</div>
          </div>
        </div>

        {/* SEARCH AND SELECT BAR */}
        <div className="search-card" style={{ marginTop: 0 }}>
          <div className="search-row">
            <div className="search-field">
              <SearchIcon />
              <input
                id="productSearch"
                type="text"
                placeholder="Cari produk UMKM (nama, deskripsi, atau toko)..."
                value={query}
                onChange={handleQueryChange}
              />
            </div>
          </div>
        </div>

        {/* CATALOG LAYOUT */}
        <div className="dir-layout" style={{ marginTop: '28px' }}>
          {/* SIDEBAR FILTERS */}
          <aside className="filters">
            <div className="filter-group">
              <h4>Kategori</h4>
              <div
                className={`filter-opt ${cat === 'all' ? 'active' : ''}`}
                onClick={() => handleCatChange('all')}
              >
                <span>Semua Kategori</span>
                <span className="count mono">{getCatCount('all')}</span>
              </div>
              {CATEGORIES.map((c) => (
                <div
                  key={c}
                  className={`filter-opt ${cat === c ? 'active' : ''}`}
                  onClick={() => handleCatChange(c)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CategoryIcon cat={c} />
                    {c}
                  </span>
                  <span className="count mono">{getCatCount(c)}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* MAIN RESULTS AREA */}
          <div>
            <div className="dir-toolbar">
              <div className="result-count">
                Menampilkan <b>{pageItems.length}</b> dari <b>{sortedList.length}</b> Produk
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', fontWeight: 600 }}>Urutkan:</span>
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: '1px solid var(--line)',
                    background: 'var(--paper)',
                    color: 'var(--ink)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="rating">⭐ Rating Terbaik</option>
                  <option value="popular">👁️ View Terbanyak</option>
                  <option value="price_asc">💵 Harga: Rendah ke Tinggi</option>
                  <option value="price_desc">💵 Harga: Tinggi ke Rendah</option>
                </select>
              </div>
            </div>

            {pageItems.length ? (
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                {pageItems.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <EmptyIcon style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, marginBottom: '6px' }}>
                  Produk tidak ditemukan
                </h3>
                <p>Coba ubah kata kunci pencarian atau bersihkan filter Kategori / Dusun.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
