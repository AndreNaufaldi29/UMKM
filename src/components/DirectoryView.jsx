'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MSMES, CATEGORIES, DUSUN } from '../data/msmes';
import MSMECard from './MSMECard';
import { SearchIcon, SortIcon, EmptyIcon, CategoryIcon } from './Icons';

const PER_PAGE = 6;

export default function DirectoryView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Load initial state from URL query parameters
  const initialQ = searchParams.get('q') || '';
  const initialCat = searchParams.get('cat') || 'all';
  const initialDusun = searchParams.get('dusun') || 'all';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // States
  const [query, setQuery] = useState(initialQ);
  const [cat, setCat] = useState(initialCat);
  const [dusun, setDusun] = useState(initialDusun);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  // Sync state if query parameters change (e.g. back/forward button)
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setCat(searchParams.get('cat') || 'all');
    setDusun(searchParams.get('dusun') || 'all');
    setSort(searchParams.get('sort') || 'newest');
    setPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="wrap section">
        <p>Memuat direktori...</p>
      </div>
    );
  }

  // Update URL parameters when state changes
  const updateUrl = (newQ, newCat, newDusun, newSort, newPage) => {
    const params = new URLSearchParams();
    if (newQ.trim()) params.set('q', newQ.trim());
    if (newCat !== 'all') params.set('cat', newCat);
    if (newDusun !== 'all') params.set('dusun', newDusun);
    if (newSort !== 'newest') params.set('sort', newSort);
    if (newPage > 1) params.set('page', newPage.toString());

    const urlString = params.toString() ? `/umkm?${params.toString()}` : '/umkm';
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

  const handleDusunChange = (newDusun) => {
    setDusun(newDusun);
    setPage(1);
    updateUrl(query, cat, newDusun, sort, 1);
  };

  const handleSortToggle = () => {
    const nextSort = sort === 'newest' ? 'az' : sort === 'az' ? 'za' : 'newest';
    setSort(nextSort);
    setPage(1);
    updateUrl(query, cat, dusun, nextSort, 1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateUrl(query, cat, dusun, sort, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper counts
  const getCatCount = (c) => MSMES.filter((m) => (c === 'all' ? true : m.cat === c)).length;
  const getDusunCount = (d) => MSMES.filter((m) => (d === 'all' ? true : m.dusun === d)).length;

  // Filter & sort logic
  const filteredList = MSMES.filter((m) => {
    const q = query.trim().toLowerCase();
    const matchQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.owner.toLowerCase().includes(q) ||
      m.cat.toLowerCase().includes(q);
    const matchCat = cat === 'all' || m.cat === cat;
    const matchDusun = dusun === 'all' || m.dusun === dusun;
    return matchQ && matchCat && matchDusun;
  });

  const sortedList = [...filteredList];
  if (sort === 'az') {
    sortedList.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'za') {
    sortedList.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    // newest (by est year descending)
    sortedList.sort((a, b) => b.est - a.est);
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
          <span className="current">UMKM Desa</span>
        </div>
      </div>

      <div className="wrap section" style={{ paddingTop: '8px' }}>
        <div className="section-head">
          <div>
            <h2>Direktori UMKM</h2>
            <div className="sub">{MSMES.length} usaha terdaftar di Desa Sukamaju</div>
          </div>
        </div>

        {/* SEARCH AND SELECT BAR */}
        <div className="search-card" style={{ marginTop: 0 }}>
          <div className="search-row">
            <div className="search-field">
              <SearchIcon />
              <input
                id="dirSearch"
                type="text"
                placeholder="Cari UMKM..."
                value={query}
                onChange={handleQueryChange}
              />
            </div>
          </div>
        </div>

        {/* DIRECTORY LAYOUT */}
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
                Menampilkan <b>{pageItems.length}</b> dari <b>{sortedList.length}</b> UMKM
              </div>
              <button className="sort-btn" id="sortBtn" onClick={handleSortToggle}>
                <SortIcon style={{ marginRight: '6px' }} />
                {sort === 'az' ? 'A–Z' : sort === 'za' ? 'Z–A' : 'Terbaru'}
              </button>
            </div>

            {pageItems.length ? (
              <div className="grid">
                {pageItems.map((m) => (
                  <MSMECard key={m.id} m={m} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <EmptyIcon style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, marginBottom: '6px' }}>
                  Tidak ada hasil
                </h3>
                <p>Coba ubah kata kunci atau filter pencarian Anda.</p>
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
