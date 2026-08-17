'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import LatestMSMECarousel from './LatestMSMECarousel';
import { ArrowIcon } from './Icons';

/**
 * HomePageDynamic — Client component untuk section Produk Unggulan dan UMKM Terbaru.
 * Menerima data dari server component (app/page.jsx) sebagai props,
 * sehingga data selalu fresh dari database saat halaman dirender.
 */
export default function HomePageDynamic({ featuredProducts = [], latestMSMEs = [] }) {
  return (
    <>
      {/* PRODUK UNGGULAN SECTION */}
      <div className="wrap section reveal" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>Produk Unggulan Desa</h2>
            <div className="sub">Karya terbaik dan produk pilihan dari warga desa</div>
          </div>
          <Link href="/produk" className="link-more">
            Lihat semua produk
            <ArrowIcon style={{ marginLeft: '4px' }} />
          </Link>
        </div>

        {featuredProducts && featuredProducts.length > 0 ? (
          <div
            className="grid reveal-stagger"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
          >
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
            Belum ada produk unggulan yang tersedia.
          </div>
        )}
      </div>

      {/* UMKM TERBARU SECTION */}
      <div className="wrap section reveal" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>UMKM Terbaru</h2>
            <div className="sub">Usaha yang baru saja bergabung dalam katalog</div>
          </div>
          <Link href="/umkm" className="link-more">
            Lihat semua
            <ArrowIcon style={{ marginLeft: '4px' }} />
          </Link>
        </div>

        {latestMSMEs && latestMSMEs.length > 0 ? (
          <LatestMSMECarousel latestMSMEs={latestMSMEs} />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
            Belum ada data UMKM yang terdaftar.
          </div>
        )}
      </div>
    </>
  );
}
