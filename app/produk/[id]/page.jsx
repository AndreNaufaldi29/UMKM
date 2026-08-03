import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRODUCTS, MSMES } from '../../../src/data/msmes';
import { ProductSVG } from '../../../src/components/DynamicSVGs';
import { 
  StarIcon, 
  EyeIcon, 
  PhoneIcon, 
  CategoryIcon, 
  PinIcon, 
  ArrowIcon,
  CheckIcon
} from '../../../src/components/Icons';
import { formatRupiah } from '../../../src/utils/formatter';
import WAFloatButton from '../../../src/components/WAFloatButton';
import ProductCard from '../../../src/components/ProductCard';
import ProductVariantSelector from '../../../src/components/ProductVariantSelector';

function getOriginalProductId(mappedId) {
  if (!mappedId || mappedId.length < 2) return null;
  if (mappedId.length === 3) {
    return `p${mappedId.slice(0, 2)}_${mappedId[2]}`;
  }
  return `p${mappedId[0]}_${mappedId[1]}`;
}

function getProductVariants(cat) {
  if (cat === 'Makanan & Minuman') {
    return ['Kemasan Standar (250g)', 'Kemasan Keluarga (500g)', 'Premium Gift Box Pack'];
  }
  if (cat === 'Fashion & Tekstil') {
    return ['Ukuran S / M', 'Ukuran L / XL', 'Ukuran XXL Custom'];
  }
  if (cat === 'Kerajinan & Kriya') {
    return ['Warna Natural', 'Finishing Vernis Glossy', 'Ukuran Kustom'];
  }
  if (cat === 'Jasa & Servis') {
    return ['Layanan Standar', 'Layanan Cepat (Express)', 'Paket Lengkap + Garansi'];
  }
  return ['Varian Standar', 'Varian Premium'];
}

function getProductProcess(cat, name) {
  if (cat === 'Makanan & Minuman') {
    return [
      { step: 1, title: 'Pemilihan Bahan', desc: 'Memilah bahan baku alami segar berkualitas tinggi langsung dari perkebunan Desa Sukamaju.' },
      { step: 2, title: 'Pengolahan Tradisional', desc: 'Bahan baku diproses higienis menggunakan metode turun-temurun untuk menjaga kualitas rasa khas pedesaan.' },
      { step: 3, title: 'Uji Mutu Berkala', desc: 'Setiap batch diuji cita rasa dan standarnya untuk menjamin kelezatan dan kebersihan terbaik.' },
      { step: 4, title: 'Pengemasan Khusus', desc: 'Dikemas rapi menggunakan wadah kedap udara ramah lingkungan demi mempertahankan aroma segar.' }
    ];
  }
  if (cat === 'Fashion & Tekstil') {
    return [
      { step: 1, title: 'Sketsa & Pola', desc: 'Membuat sketsa hiasan gambar motif tradisional khas terasering Sukamaju pada kain mori prima.' },
      { step: 2, title: 'Pewarnaan Canting', desc: 'Melapisi malam secara manual dengan canting lalu mewarnainya dengan pewarna alam pilihan.' },
      { step: 3, title: 'Pelodoran Malam', desc: 'Melarutkan malam dalam air mendidih (lorot) untuk memunculkan kombinasi motif warna yang indah.' },
      { step: 4, title: 'Penyetrikaan & Finishing', desc: 'Menyetrika kain dengan kehangatan pas dan melakukan penjahitan pinggir agar rapi siap digunakan.' }
    ];
  }
  if (cat === 'Kerajinan & Kriya') {
    return [
      { step: 1, title: 'Penyediaan Bahan Kriya', desc: 'Memilah bilah bambu tali yang liat atau tanah liat murni dari lembah sungai Desa Sukamaju.' },
      { step: 2, title: 'Pembentukan Kerajinan', desc: 'Menganyam serat bambu secara manual atau memutar tanah liat basah dengan meja putar manual.' },
      { step: 3, title: 'Pengeringan Udara', desc: 'Mengeringkan produk mentah di bawah sirkulasi udara teduh selama 3-5 hari agar tidak retak.' },
      { step: 4, title: 'Pembakaran / Pelapisan', desc: 'Membakar produk gerabah di dalam tungku arang suhu tinggi atau melumuri anyaman dengan cairan anti-rayap.' }
    ];
  }
  return [
    { step: 1, title: 'Pemeriksaan Bahan Baku', desc: 'Memilah bahan berkualitas tinggi dari hasil alam terbaik Desa Sukamaju.' },
    { step: 2, title: 'Proses Pengolahan', desc: 'Proses produksi secara teliti oleh pengrajin lokal berpengalaman.' },
    { step: 3, title: 'Pemeriksaan Mutu akhir', desc: 'Pengecekan kelayakan akhir sebelum dikemas guna menjaga standar keawetan.' },
    { step: 4, title: 'Pengemasan & Siap Kirim', desc: 'Produk dikemas dengan kemasan kokoh aman benturan siap dikirim ke pembeli.' }
  ];
}

function getProductTestimonials(name) {
  return [
    {
      id: 1,
      buyer: 'Andi Pratama',
      date: '3 hari yang lalu',
      rating: 5,
      comment: `Sangat puas beli "${name}" ini! Pengirimannya cepat sekali dan kualitas produknya jauh di atas ekspektasi saya. Pasti bakal beli lagi dari toko ini.`
    },
    {
      id: 2,
      buyer: 'Siti Aminah',
      date: '1 minggu yang lalu',
      rating: 4.8,
      comment: `Produknya rapi sekali dan pelayanannya ramah. Senang sekali bisa mendukung perekonomian lokal UMKM Desa Sukamaju.`
    }
  ];
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const originalId = getOriginalProductId(id);
  const p = PRODUCTS.find((x) => x.id === originalId);
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
  const originalId = getOriginalProductId(id);
  const p = PRODUCTS.find((x) => x.id === originalId);

  if (!p) {
    notFound();
  }

  const msme = MSMES.find((m) => m.id === p.msmeId);
  const waUrl = p.wa 
    ? `https://wa.me/${p.wa}?text=${encodeURIComponent(
        `Halo, saya tertarik dengan produk "${p.name}" dari toko Anda ("${p.msmeName}"). Apakah produk ini tersedia?`
      )}` 
    : null;

  // Get other products from the same MSME
  const relatedProducts = PRODUCTS.filter(
    (x) => x.msmeId === p.msmeId && x.id !== p.id
  ).slice(0, 4);

  const variants = getProductVariants(p.cat);
  const processSteps = getProductProcess(p.cat, p.name);
  const testimonials = getProductTestimonials(p.name);

  return (
    <main className='home-page'>
      {/* BREADCRUMB */}
      <div className="wrap reveal reveal-left">
        <div className="breadcrumb">
          <Link href="/">Beranda</Link>
          <span className="sep">/</span>
          <Link href="/products">Katalog Produk</Link>
          <span className="sep">/</span>
          <span className="current">{p.name}</span>
        </div>
      </div>

      <div className="wrap section" style={{ paddingTop: '8px' }}>
        <div className="detail-layout">
          {/* LEFT: PHOTO & METRICS */}
          <div className="reveal reveal-left">
            <div className="panel detail-photo-panel" style={{ padding: 0, overflow: 'hidden', aspectRatio: '4/3' }}>
              <ProductSVG 
                cat={p.cat} 
                seed={p.name.length + p.price} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            <div className="panel" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                    <StarIcon style={{ color: '#FBBF24', width: '16px', height: '16px' }} />
                    <b>{p.rating.toFixed(1)}</b> <span style={{ color: 'var(--ink-soft)' }}>/ 5.0</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                    <EyeIcon style={{ width: '16px', height: '16px' }} />
                    <span>{p.views} Kali Dilihat</span>
                  </span>
                </div>
                <Link href={`/products?cat=${encodeURIComponent(p.cat)}`} className="badge" style={{ cursor: 'pointer' }}>
                  <CategoryIcon cat={p.cat} />
                  <span style={{ marginLeft: '6px' }}>{p.cat}</span>
                </Link>
              </div>
            </div>

            {/* PROCESS MAP / PEMBUATAN */}
            <div className="panel" style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>Proses Pembuatan</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {processSteps.map((step) => (
                  <div key={step.step} style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--forest-soft)', 
                      color: 'var(--forest)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 700, 
                      fontSize: '0.85rem',
                      flexShrink: 0
                    }}>
                      {step.step}
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--ink)' }}>{step.title}</h5>
                      <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', marginTop: '2px', lineHeight: '1.4' }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PURCHASING FLOW / ALUR PEMBELIAN */}
            <div className="panel" style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>Alur Pembelian</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--soil-soft)', color: 'var(--soil)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>1</div>
                  <span style={{ fontSize: '0.86rem', color: 'var(--ink-soft)' }}>Pilih varian produk yang Anda inginkan di halaman ini.</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--soil-soft)', color: 'var(--soil)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>2</div>
                  <span style={{ fontSize: '0.86rem', color: 'var(--ink-soft)' }}>Klik tombol <b>Beli via WhatsApp</b> untuk terhubung dengan penjual.</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--soil-soft)', color: 'var(--soil)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>3</div>
                  <span style={{ fontSize: '0.86rem', color: 'var(--ink-soft)' }}>Kirim pesan otomatis lalu sepakati ongkos kirim & alamat kirim.</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--soil-soft)', color: 'var(--soil)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>4</div>
                  <span style={{ fontSize: '0.86rem', color: 'var(--ink-soft)' }}>Lakukan transfer pembayaran secara aman dan pesanan dikirimkan.</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS & ACTIONS */}
          <div className="reveal reveal-right">
            <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ marginBottom: '10px' }}>
                  <Link 
                    href={`/products?cat=${encodeURIComponent(p.cat)}`} 
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

              <div>
                <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-soft)', marginBottom: '8px' }}>Deskripsi Produk</h4>
                <p style={{ color: 'var(--ink-soft)', fontSize: '0.96rem', lineHeight: '1.6' }}>{p.desc}</p>
              </div>

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
                            <PinIcon style={{ width: '12px', height: '12px' }} />
                            <span>{msme ? msme.dusun : p.dusun}</span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <span>Est.</span>
                            <b>{msme ? msme.est : p.est}</b>
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

              {/* PRODUCT TESTIMONIALS */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '18px', marginTop: '6px' }}>
                <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-soft)', marginBottom: '12px' }}>Ulasan Pembeli ({testimonials.length})</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {testimonials.map((t) => (
                    <div key={t.id} style={{ borderBottom: t.id === 1 ? '1px dashed var(--line)' : 'none', paddingBottom: t.id === 1 ? '14px' : '0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <b style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>{t.buyer}</b>
                        <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>{t.date}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '3px', margin: '4px 0' }}>
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <StarIcon 
                            key={starIdx} 
                            style={{ 
                              color: starIdx < Math.floor(t.rating) ? '#FBBF24' : 'var(--line)', 
                              width: '12px', 
                              height: '12px' 
                            }} 
                          />
                        ))}
                      </div>
                      <p style={{ fontSize: '0.84rem', color: 'var(--ink-soft)', lineHeight: '1.4', fontStyle: 'italic' }}>{t.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="reveal reveal-scale" style={{ marginTop: '48px' }}>
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
                    msmeName: msme?.name || '', 
                    msmeId: msme?.id || 1, 
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
