import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { PRODUCTS, MSMES } from '../../../src/data/msmes';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { ProductSVG } from '../../../src/components/DynamicSVGs';
import { 
  StarIcon, 
  EyeIcon, 
  CategoryIcon, 
  PinIcon, 
  ArrowIcon,
} from '../../../src/components/Icons';
import { formatRupiah } from '../../../src/utils/formatter';
import { withBasePath } from '../../../src/utils/basePath';
import WAFloatButton from '../../../src/components/WAFloatButton';
import ProductCard from '../../../src/components/ProductCard';
import ProductVariantSelector from '../../../src/components/ProductVariantSelector';
import ProductGallery from '../../../src/components/ProductGallery';

function getOriginalProductId(mappedId) {
  if (!mappedId || mappedId.length < 2) return null;
  if (mappedId.length === 3) {
    return `p${mappedId.slice(0, 2)}_${mappedId[2]}`;
  }
  return `p${mappedId[0]}_${mappedId[1]}`;
}

async function getProductDetail(id) {
  const decodedId = decodeURIComponent(id);
  const originalId = getOriginalProductId(decodedId);

  try {
    // 1. Direct ID Lookup (e.g. 'p2_1786598503806' or 'p1_1')
    let p = await prisma.product.findUnique({
      where: { id: decodedId },
      include: {
        umkm: {
          include: {
            category: true,
          }
        }
      }
    });

    // 2. Fallback to legacy mapped ID if direct lookup returns null (e.g. '11' -> 'p1_1')
    if (!p && originalId && originalId !== decodedId) {
      p = await prisma.product.findUnique({
        where: { id: originalId },
        include: {
          umkm: {
            include: {
              category: true,
            }
          }
        }
      });
    }

    // 3. Fallback to in-memory PRODUCTS array
    if (!p) {
      p = PRODUCTS.find((x) => x.id === decodedId || x.id === originalId);
    }

    if (!p) return null;

    let processedImages = [];
    if (Array.isArray(p.images) && p.images.length > 0) {
      processedImages = p.images;
    } else if (p.imageUrl) {
      const trimmed = p.imageUrl.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          processedImages = JSON.parse(trimmed);
        } catch (e) {}
      }
      if (processedImages.length === 0) {
        processedImages = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
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
      images: processedImages,
      msmeId: p.umkmId || p.msmeId,
      msmeName: p.umkm ? p.umkm.name : (p.msmeName || ''),
      cat: p.umkm && p.umkm.category ? p.umkm.category.name : (p.cat || 'Lainnya'),
      est: p.umkm ? p.umkm.est : (p.est || 2020),
      status: p.umkm ? p.umkm.status : (p.status || 'active'),
      wa: p.umkm ? p.umkm.wa : (p.wa || '')
    };
  } catch (error) {
    console.error('Error fetching product from DB:', error);
    return PRODUCTS.find((x) => x.id === decodedId || x.id === originalId) || null;
  }
}

async function getRelatedProducts(msmeId, currentProdId) {
  try {
    const prods = await prisma.product.findMany({
      where: { umkmId: msmeId, NOT: { id: currentProdId } },
      include: { umkm: { include: { category: true } } },
      take: 4
    });
    return prods.map((p) => ({
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
      msmeId: p.umkmId,
      msmeName: p.umkm ? p.umkm.name : '',
      cat: p.umkm && p.umkm.category ? p.umkm.category.name : 'Lainnya',
      status: p.umkm ? p.umkm.status : 'active',
      wa: p.umkm ? p.umkm.wa : ''
    }));
  } catch (error) {
    return PRODUCTS.filter((x) => x.msmeId === msmeId && x.id !== currentProdId).slice(0, 4);
  }
}

function getProductVariants(cat) {
  if (cat === 'Kuliner' || cat === 'Makanan & Minuman') {
    return ['Kemasan Standar (250g)', 'Kemasan Keluarga (500g)', 'Premium Gift Box Pack'];
  }
  if (cat === 'Fashion' || cat === 'Fashion & Tekstil') {
    return ['Ukuran S / M', 'Ukuran L / XL', 'Ukuran XXL Custom'];
  }
  if (cat === 'Kerajinan' || cat === 'Kerajinan & Kriya') {
    return ['Warna Natural', 'Finishing Vernis Glossy', 'Ukuran Kustom'];
  }
  if (cat === 'Jasa' || cat === 'Jasa & Servis') {
    return ['Layanan Standar', 'Layanan Cepat (Express)', 'Paket Lengkap + Garansi'];
  }
  return ['Varian Standar', 'Varian Premium'];
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = await getProductDetail(id);
  if (!p) {
    return {
      title: 'Produk Tidak Ditemukan - Desa Sukamaju',
      description: 'Detail produk tidak ditemukan.',
    };
  }
  return {
    title: `${p.name} - Katalog Produk Desa Sukamaju`,
    description: p.desc,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const p = await getProductDetail(id);

  if (!p) {
    notFound();
  }

  // Increment view counter in DB asynchronously
  try {
    await prisma.product.update({
      where: { id: p.id },
      data: { views: { increment: 1 } }
    });
  } catch (e) {
    // Ignore if counter update fails
  }

  const relatedProducts = await getRelatedProducts(p.msmeId, p.id);
  const variants = getProductVariants(p.cat);

  return (
    <main className="container page-content detail-container">
      {/* BREADCRUMB */}
      <div>
        <div className="breadcrumb">
          <Link href="/">Beranda</Link>
          <span className="sep">/</span>
          <Link href="/produk">Katalog Produk</Link>
          <span className="sep">/</span>
          <span className="current">{p.name}</span>
        </div>
      </div>

      <div className="section" style={{ paddingTop: '8px' }}>
        <div className="detail-layout">
          {/* LEFT: PHOTO GALLERY & METRICS */}
          <div>
            <ProductGallery 
              images={p.images} 
              imageUrl={p.imageUrl} 
              name={p.name} 
              cat={p.cat} 
              price={p.price} 
              id={p.id} 
            />

            <div className="panel reveal reveal-left" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                    <EyeIcon style={{ width: '16px', height: '16px' }} />
                    <span>{p.views + 1} Kali Dilihat</span>
                  </span>
                </div>
                <Link href={`/produk?cat=${encodeURIComponent(p.cat)}`} className="badge" style={{ cursor: 'pointer' }}>
                  <CategoryIcon cat={p.cat} />
                  <span style={{ marginLeft: '6px' }}>{p.cat}</span>
                </Link>
              </div>
            </div>

            {/* DESKRIPSI PRODUK */}
            <div className="panel reveal reveal-left" style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '14px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
                Deskripsi Produk
              </h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.96rem', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line' }}>
                {p.desc || 'Belum ada deskripsi untuk produk ini.'}
              </p>
            </div>
          </div>

          {/* RIGHT: DETAILS & ACTIONS */}
          <div className="reveal reveal-right">
            <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ marginBottom: '10px' }}>
                  <Link 
                   href={`/produk?cat=${encodeURIComponent(p.cat)}`} 
                    className="badge" 
                    style={{ cursor: 'pointer', display: 'inline-flex' }}
                  >
                    <CategoryIcon cat={p.cat} />
                    <span style={{ marginLeft: '6px' }}>{p.cat}</span>
                  </Link>
                </div>
                <h1 style={{ fontSize: '1.9rem', fontWeight: 600, color: 'var(--ink)', lineHeight: '1.2', marginBottom: '6px' }}>{p.name}</h1>
                <div className="pprice" style={{ fontSize: '1.7rem', fontWeight: 700, color: 'var(--soil)', fontFamily: 'IBM Plex Mono, monospace' }}>
                  {formatRupiah(p.price)}
                  {p.unit && <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--ink-soft)' }}>/{p.unit}</span>}
                </div>
              </div>

              {/* VARIANTS & ACTION BUTTONS */}
              <ProductVariantSelector 
                variants={variants} 
                productName={p.name} 
                msmeName={p.msmeName} 
                waNumber={p.wa} 
                status={p.status} 
              />

              {/* BRIEF MSME DETAIL */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '18px', marginTop: '6px' }}>
                <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-soft)', marginBottom: '8px' }}>Toko Penjual (UMKM)</h4>
                <Link href={`/umkm/${p.msmeId}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div className="stat-card" style={{ padding: '14px 18px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 className="num" style={{ fontSize: '1.1rem', color: 'var(--forest)' }}>{p.msmeName}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: 'var(--ink-soft)', marginTop: '6px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <span>Est.</span>
                            <b>{p.est}</b>
                          </span>
                        </div>
                      </div>
                      <ArrowIcon style={{ color: 'var(--forest)' }} />
                    </div>
                  </div>
                </Link>
              </div>

              {/* STORE LINK */}
              <div>
                <Link 
                  href={`/umkm/${p.msmeId}`} 
                  className="btn btn-outline" 
                  style={{ width: '100%', padding: '12px 22px', justifyContent: 'center' }}
                >
                  <span>Kunjungi Profil Toko</span>
                </Link>
              </div>


            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="reveal reveal-scale" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--line)' }}>
            <div className="section-head" style={{ marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600 }}>Produk Lain dari Toko Ini</h3>
                <div className="sub">Telusuri keragaman produk dari pelaku usaha yang sama</div>
              </div>
            </div>
            <div className="products-grid reveal-stagger">
              {relatedProducts.map((rp) => (
                <ProductCard 
                  key={rp.id} 
                  p={{ 
                    ...rp, 
                    msmeName: p.msmeName, 
                    msmeId: p.msmeId, 
                    cat: rp.cat || p.cat, 
                    status: 'active',
                    rating: rp.rating || 5.0,
                    views: rp.views || 100
                  }} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <WAFloatButton waNumber={p.wa} />
    </main>
  );
}