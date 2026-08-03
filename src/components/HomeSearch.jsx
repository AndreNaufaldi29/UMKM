'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, CategoryIcon } from './Icons';
import { CATEGORIES } from '../data/msmes';

export default function HomeSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/umkm?q=${encodeURIComponent(query.trim())}`);
  };

  const handleCategoryClick = (cat) => {
    router.push(`/products?cat=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="search-card">
      <form onSubmit={handleSearchSubmit} className="search-row">
        <div className="search-field">
          <SearchIcon />
          <input
            type="text"
            placeholder="Cari nama UMKM, pemilik, atau kategori..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="btn">
          Cari
        </button>
      </form>

      <div className="chip-row">
        <button className="chip" onClick={() => router.push('/products')}>
          Semua Kategori
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} className="chip" onClick={() => handleCategoryClick(c)}>
            <CategoryIcon cat={c} />
            <span style={{ marginLeft: '4px' }}>{c}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
