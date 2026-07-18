import React from 'react';
import Link from 'next/link';
import HeroCarousel from '../src/components/HeroCarousel';
import HomeSearch from '../src/components/HomeSearch';
import MSMECard from '../src/components/MSMECard';
import { MSMES, CATEGORIES } from '../src/data/msmes';
import { ArrowIcon } from '../src/components/Icons';

export default function Home() {
  const totalUMKM = MSMES.length;
  const totalCats = CATEGORIES.length;
  const totalProducts = MSMES.reduce((sum, m) => sum + (m.products?.length || 0), 0);

  // Latest 6 MSMEs by est year
  const latestMSMEs = [...MSMES]
    .sort((a, b) => b.est - a.est)
    .slice(0, 6);

  return (
    <main>
      {/* HERO CAROUSEL */}
      <HeroCarousel />

      {/* SEARCH CARD */}
      <div className="wrap">
        <HomeSearch />
      </div>

      {/* STATS SECTION */}
      <div className="wrap section">
        <div className="section-head">
          <div>
            <h2>Sekilas Desa Sukamaju</h2>
            <div className="sub">Ringkasan data UMKM terkini</div>
          </div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-number mono" style={{ fontSize: '2.1rem', fontWeight: 600, color: 'var(--forest)' }}>
              {String(totalUMKM).padStart(2, '0')}
            </div>
            <div className="stat-label">Total UMKM Terdaftar</div>
            <div className="stat-accent" style={{ position: 'absolute', top: '20px', right: '20px', width: '8px', height: '8px', borderRadius: '999px', background: 'var(--soil)' }}></div>
          </div>

          <div className="stat-card">
            <div className="stat-number mono" style={{ fontSize: '2.1rem', fontWeight: 600, color: 'var(--forest)' }}>
              {String(totalCats).padStart(2, '0')}
            </div>
            <div className="stat-label">Kategori Usaha</div>
            <div className="stat-accent" style={{ position: 'absolute', top: '20px', right: '20px', width: '8px', height: '8px', borderRadius: '999px', background: 'var(--soil)' }}></div>
          </div>

          <div className="stat-card">
            <div className="stat-number mono" style={{ fontSize: '2.1rem', fontWeight: 600, color: 'var(--forest)' }}>
              {String(totalProducts).padStart(2, '0')}
            </div>
            <div className="stat-label">Produk Unggulan</div>
            <div className="stat-accent" style={{ position: 'absolute', top: '20px', right: '20px', width: '8px', height: '8px', borderRadius: '999px', background: 'var(--soil)' }}></div>
          </div>
        </div>
      </div>

      {/* LATEST MSMES */}
      <div className="wrap section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>UMKM Terbaru</h2>
            <div className="sub">Usaha yang baru saja bergabung dalam katalog</div>
          </div>
          <Link href="/directory" className="link-more">
            Lihat semua
            <ArrowIcon style={{ marginLeft: '4px' }} />
          </Link>
        </div>

        <div className="latest-scroll">
          {latestMSMEs.map((m) => (
            <MSMECard key={m.id} m={m} />
          ))}
        </div>
      </div>
    </main>
  );
}
