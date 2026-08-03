import React from 'react';
import Link from 'next/link';
import HeroCarousel from '../src/components/HeroCarousel';
import HomeSearch from '../src/components/HomeSearch';
import MSMECard from '../src/components/MSMECard';
import ProductCard from '../src/components/ProductCard';
import TestimonialCarousel from '../src/components/TestimonialCarousel';
import AnimatedCounter from '../src/components/AnimatedCounter';
import { MSMES, CATEGORIES, PRODUCTS } from '../src/data/msmes';
import { ArrowIcon, CategoryIcon } from '../src/components/Icons';

export default function Home() {
  const totalUMKM = MSMES.length;
  const totalCats = CATEGORIES.length;
  const totalProducts = PRODUCTS.length;

  // Latest 6 MSMEs by est year
  const latestMSMEs = [...MSMES]
    .sort((a, b) => b.est - a.est)
    .slice(0, 6);

  // Top 4 featured products sorted by rating descending
  const featuredProducts = [...PRODUCTS]
    .filter((p) => p.isFeatured)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <main className="home-page">
      {/* HERO CAROUSEL */}
      <HeroCarousel />
      {/* SEARCH CARD */}
      <div className="wrap search-wrap reveal reveal-scale">
        <HomeSearch />
      </div>

      {/* TESTIMONIALS SECTION */}
      <div className="wrap section reveal" style={{ paddingBottom: 0 }}>
        <div className="section-head" style={{ marginBottom: '24px', justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600 }}>Apa Kata Mereka?</h2>
            <div className="sub">Ulasan tulus dari para pembeli produk unggulan UMKM kami</div>
          </div>
        </div>

        <TestimonialCarousel />
      </div>

      {/* STATS SECTION */}
      <div className="wrap section reveal">
        <div className="section-head">
          <div>
            <h2>Sekilas Desa Kedungsumur</h2>
            <div className="sub">Ringkasan data UMKM terkini</div>
          </div>
        </div>

        <div className="stats reveal-stagger">
          <div className="stat-card">
            <div className="num">
              <AnimatedCounter targetValue={totalUMKM} />
            </div>
            <div className="label">Total UMKM Terdaftar</div>
            <div className="tick"></div>
          </div>

          <div className="stat-card">
            <div className="num">
              <AnimatedCounter targetValue={totalCats} />
            </div>
            <div className="label">Kategori Usaha</div>
            <div className="tick"></div>
          </div>

          <div className="stat-card">
            <div className="num">
              <AnimatedCounter targetValue={totalProducts} />
            </div>
            <div className="label">Produk Unggulan</div>
            <div className="tick"></div>
          </div>
        </div>
      </div>

      {/* KATEGORI PILIHAN SECTION */}
      <div className="wrap section reveal" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>Kategori Produk</h2>
            <div className="sub">Jelajahi produk berdasarkan sektor UMKM</div>
          </div>
        </div>
        <div className="category-home-grid reveal-stagger">
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/products?cat=${c}`} className="cat-home-card">
              <div className="cat-home-icon">
                <CategoryIcon cat={c} width="22" height="22" />
              </div>
              <span className="cat-home-title">{c}</span>
              <span className="cat-home-count mono">
                {PRODUCTS.filter(p => p.cat === c).length} Produk
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* PRODUK UNGGULAN SECTION */}
      <div className="wrap section reveal" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>Produk Unggulan Desa</h2>
            <div className="sub">Karya terbaik dan produk pilihan dari warga desa</div>
          </div>
          <Link href="/products" className="link-more">
            Lihat semua produk
            <ArrowIcon style={{ marginLeft: '4px' }} />
          </Link>
        </div>

        <div className="grid reveal-stagger" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>

      {/* LATEST MSMES */}
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

        <div className="latest-scroll reveal-stagger">
          {latestMSMEs.map((m) => (
            <MSMECard key={m.id} m={m} />
          ))}
        </div>
      </div>
    </main>
  );
}
