import React from 'react';
import Link from 'next/link';
import HeroCarousel from '../src/components/HeroCarousel';
import HomeSearch from '../src/components/HomeSearch';
import LatestMSMECarousel from '../src/components/LatestMSMECarousel';
import AnimatedCounter from '../src/components/AnimatedCounter';
import { ArrowIcon, CategoryIcon } from '../src/components/Icons';
import HomePageDynamic from '../src/components/HomePageDynamic';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_CATEGORIES = ['Kuliner', 'Kerajinan', 'Fashion', 'Pertanian', 'Jasa'];

async function getHomeData() {
  try {
    // Ambil semua UMKM dengan produk dari database
    const umkms = await prisma.umkm.findMany({
      include: {
        category: true,
        products: true,
      },
      orderBy: { id: 'asc' },
    });

    const msmes = umkms.map((u) => {
      const products = (u.products || []).map((p) => {
        let imageList = [];
        if (p.imageUrl) {
          const trimmed = p.imageUrl.trim();
          if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try { imageList = JSON.parse(trimmed); } catch (e) {}
          }
          if (imageList.length === 0) {
            imageList = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
          }
        }
        return {
          id: p.id,
          name: p.name,
          desc: p.desc,
          price: p.price,
          unit: p.unit,
          rating: p.rating,
          sales: p.sales,
          views: p.views,
          isFeatured: p.isFeatured,
          imageUrl: p.imageUrl || '',
          images: imageList,
          msmeId: u.id,
          msmeName: u.name,
          cat: u.category ? u.category.name : 'Lainnya',
          status: u.status,
          wa: u.wa,
        };
      });

      return {
        id: u.id,
        name: u.name,
        owner: u.owner,
        cat: u.category ? u.category.name : 'Lainnya',
        est: u.est,
        status: u.status,
        addr: u.addr,
        imageUrl: u.imageUrl || '',
        wa: u.wa,
        products,
      };
    });

    // Ambil semua produk (flat dari semua UMKM)
    const products = msmes.flatMap((m) => m.products);

    // Ambil kategori unik dari database
    const dbCats = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    const categories = dbCats.length > 0
      ? dbCats.map((c) => c.name)
      : DEFAULT_CATEGORIES;

    return { msmes, products, categories };
  } catch (error) {
    console.error('Error fetching home data from DB:', error);
    return { msmes: [], products: [], categories: DEFAULT_CATEGORIES };
  }
}

export default async function Home() {
  const { msmes, products, categories } = await getHomeData();

  const totalUMKM    = msmes.length;
  const totalCats    = categories.length;
  const totalProducts = products.length;

  // Latest 6 MSMEs by est year (terbaru)
  const latestMSMEs = [...msmes]
    .sort((a, b) => b.est - a.est)
    .slice(0, 6);

  // Top 4 featured products sorted by rating
  const featuredProducts = [...products]
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
          {categories.map((c) => (
            <Link key={c} href={`/produk?cat=${encodeURIComponent(c)}`} className="cat-home-card">
              <div className="cat-home-icon">
                <CategoryIcon cat={c} width="22" height="22" />
              </div>
              <span className="cat-home-title">{c}</span>
              <span className="cat-home-count mono">
                {products.filter((p) => p.cat === c).length} Produk
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* PRODUK UNGGULAN & UMKM TERBARU — render via client component agar dapat refresh dinamis */}
      <HomePageDynamic
        featuredProducts={featuredProducts}
        latestMSMEs={latestMSMEs}
      />
    </main>
  );
}
