import UMKMBannerImage from '../../../src/components/UMKMBannerImage';
import { withBasePath } from '../../../src/utils/basePath';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { MSMES } from '../../../src/data/msmes';
import { PhotoSVG } from '../../../src/components/DynamicSVGs';
import DetailActions from '../../../src/components/DetailActions';
import WAFloatButton from '../../../src/components/WAFloatButton';
import ProductCard from '../../../src/components/ProductCard';
import {
  PinIcon,
  CheckIcon,
  AwardIcon,
  RouteIcon,
  CategoryIcon,
  PhoneIcon,
  MailIcon,
  GlobeIcon,
  FbIcon,
  IgIcon,
  TiktokIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  ShoppingBagIcon
} from '../../../src/components/Icons';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getUmkmDetail(id) {
  const umkmId = parseInt(id, 10);
  if (isNaN(umkmId)) return null;

  try {
    const u = await prisma.umkm.findUnique({
      where: { id: umkmId },
      include: {
        category: true,
        certifications: true,
        products: true
      }
    });

    if (!u) return null;

    return {
      id: u.id,
      name: u.name,
      owner: u.owner,
      cat: u.category ? u.category.name : 'Lainnya',
      est: u.est,
      status: u.status,
      addr: u.addr,
      hours: u.hours || '',
      desc: u.desc,
      history: u.history || '',
      latitude: u.latitude ?? null,
      longitude: u.longitude ?? null,
      imageUrl: u.imageUrl || '',
      wa: u.wa,
      phone: u.phone,
      email: u.email,
      web: u.web,
      fb: u.fb,
      ig: u.ig,
      tiktok: u.tiktok,
      certs: u.certifications.map((c) => c.certName),
      products: u.products.map((p) => {
        let imageList = [];
        if (p.imageUrl) {
          const trimmed = p.imageUrl.trim();
          if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
              imageList = JSON.parse(trimmed);
            } catch (e) {}
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
          images: imageList
        };
      })
    };
  } catch (error) {
    console.error('Error fetching UMKM detail from DB:', error);
    return MSMES.find((x) => x.id === umkmId) || null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const m = await getUmkmDetail(id);
  if (!m) {
    return {
      title: 'UMKM Tidak Ditemukan - Kedungsumur'
    };
  }
  return {
    title: `${m.name} - UMKM Desa Kedungsumur`,
    description: m.desc
  };
}

export default async function UMKMDetailPage({ params }) {
  const { id } = await params;
  const m = await getUmkmDetail(id);

  if (!m) {
    notFound();
  }

  const contacts = [
    { ic: 'wa', val: m.wa, href: m.wa ? `https://wa.me/${m.wa}` : null, lbl: 'WhatsApp' },
    { ic: 'phone', val: m.phone, href: m.phone ? `tel:${m.phone}` : null, lbl: 'Telepon' },
    { ic: 'email', val: m.email, href: m.email ? `mailto:${m.email}` : null, lbl: 'Email' },
    { ic: 'web', val: m.web, href: m.web ? (m.web.startsWith('http') ? m.web : `https://${m.web}`) : null, lbl: 'Website' },
    { ic: 'ig', val: m.ig ? `@${m.ig.replace('@', '')}` : '', href: m.ig ? `https://instagram.com/${m.ig.replace('@', '')}` : null, lbl: 'Instagram' },
    { ic: 'tiktok', val: m.tiktok ? `@${m.tiktok.replace('@', '')}` : '', href: m.tiktok ? `https://tiktok.com/@${m.tiktok.replace('@', '')}` : null, lbl: 'TikTok' },
    { ic: 'fb', val: m.fb, href: m.fb ? `https://facebook.com/${m.fb}` : null, lbl: 'Facebook' },
  ].filter((c) => c.val);

  const getContactIcon = (ic) => {
    switch (ic) {
      case 'wa': return <PhoneIcon />;
      case 'phone': return <PhoneIcon />;
      case 'email': return <MailIcon />;
      case 'web': return <GlobeIcon />;
      case 'ig': return <IgIcon />;
      case 'tiktok': return <TiktokIcon />;
      case 'fb': return <FbIcon />;
      default: return null;
    }
  };

  const lat = m.latitude !== null && m.latitude !== undefined ? m.latitude : (-7.2504 - (m.id * 0.0011)).toFixed(6);
  const lng = m.longitude !== null && m.longitude !== undefined ? m.longitude : (110.1502 + (m.id * 0.0013)).toFixed(6);

  return (
    <main className="container page-content detail-container">
      {/* BREADCRUMB */}
      <nav className="breadcrumb reveal" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link>
        <span className="sep">/</span>
        <Link href="/umkm">Direktori UMKM</Link>
        <span className="sep">/</span>
        <span className="current">{m.name}</span>
      </nav>

      {/* HERO BANNER & PROFILES */}
      <div 
        className="panel detail-hero-panel reveal reveal-scale" 
        style={{ 
          padding: 0, 
          overflow: 'hidden', 
          borderRadius: 'var(--radius)', 
          position: 'relative', 
          background: 'var(--card-bg)',
          border: '1px solid var(--line)'
        }}
      >
        {/* BANNER PHOTO CONTAINER */}
        <div style={{ position: 'relative', width: '100%', height: '320px', background: '#2D3748' }}>
          <UMKMBannerImage imageUrl={m.imageUrl} name={m.name} cat={m.cat} id={m.id} />

          {/* GRADIENT OVERLAY */}
          <div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'flex-end', 
              padding: '24px 28px',
              pointerEvents: 'none'
            }}
          >
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'var(--soil)', color: '#fff', border: 'none', fontWeight: 700 }}>
                <CategoryIcon cat={m.cat} /> {m.cat}
              </span>
              <span className="badge" style={{ background: m.status === 'inactive' ? 'rgba(239,68,68,0.85)' : 'rgba(34,197,94,0.85)', color: '#fff', border: 'none' }}>
                {m.status === 'inactive' ? '✕ Tutup Sementara' : '✓ Aktif Beroperasi'}
              </span>
            </div>

            <h1 style={{ color: '#fff', fontSize: '2.1rem', fontWeight: 700, margin: '4px 0 8px', textShadow: '0 2px 6px rgba(0,0,0,0.6)', lineHeight: '1.2' }}>
              {m.name}
            </h1>

            <p style={{ margin: 0, color: 'rgba(255,255,255,0.92)', fontSize: '0.96rem', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span>Pemilik: <b>{m.owner}</b></span>
              <span>•</span>
              <span>Berdiri Sejak: <b>{m.est}</b></span>
            </p>
          </div>
        </div>

        {/* HERO TOOLBAR & QUICK STATS */}
        <div 
          style={{ 
            padding: '16px 28px', 
            background: 'var(--card-bg)', 
            borderTop: '1px solid var(--line)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '16px' 
          }}
        >
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.86rem', color: 'var(--ink-soft)' }}>
              <span style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Alamat Utama</span>
              <b style={{ color: 'var(--ink)' }}>{m.addr}</b>
            </div>
          </div>

          <DetailActions name={m.name} wa={m.wa} />
        </div>
      </div>

      {/* DETAIL LAYOUT: MAIN + SIDEBAR */}
      <div className="detail-layout" style={{ marginTop: '28px' }}>
        {/* MAIN COLUMN */}
        <div className="detail-main">
          {/* PROFILE DESCRIPTION */}
          <div className="panel reveal">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏪 Profil Usaha
            </h3>
            <p style={{ fontSize: '1.02rem', color: 'var(--ink)', lineHeight: '1.7', margin: 0 }}>
              {m.desc}
            </p>

            <div className="info-grid" style={{ marginTop: '24px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
              <div className="info-row">
                <span className="k" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserIcon width="14" height="14" /> Nama Pemilik Usaha
                </span>
                <span className="v">{m.owner}</span>
              </div>
              <div className="info-row">
                <span className="k" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CategoryIcon cat={m.cat} /> Kategori Usaha
                </span>
                <span className="v">{m.cat}</span>
              </div>
              <div className="info-row">
                <span className="k" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarIcon width="14" height="14" /> Tahun Berdiri
                </span>
                <span className="v">{m.est}</span>
              </div>
              <div className="info-row">
                <span className="k" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ClockIcon width="14" height="14" /> Jam Operasional
                </span>
                <span className="v">{m.hours || '08.00 – 17.00 setiap hari'}</span>
              </div>
              <div className="info-row">
                <span className="k">Status Operasional</span>
                <span className="v" style={{ color: m.status === 'inactive' ? 'var(--red, #ef4444)' : 'var(--forest)' }}>
                  {m.status === 'inactive' ? 'Tutup Sementara' : 'Aktif Beroperasi'}
                </span>
              </div>
            </div>
          </div>

          {/* BRIEF HISTORY */}
          <div className="panel reveal">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '14px' }}>
              📖 Sejarah Singkat Usaha
            </h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
              {m.history || `Didirikan oleh ${m.owner} pada tahun ${m.est}, ${m.name} bermula dari industri rumah tangga kecil yang didasari keinginan luhur untuk memajukan potensi daerah. Berkat konsistensi dalam mempertahankan mutu produk ${m.cat} pilihan, kini usaha ini telah berkembang pesat sebagai salah satu penyedia produk lokal tepercaya di Desa Sukamaju, sekaligus berkontribusi aktif dalam meningkatkan taraf hidup warga dan memberdayakan para pemuda desa.`}
            </p>
          </div>

          {/* PRODUCTS CATALOG */}
          <div className="panel reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--ink)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBagIcon width="18" height="18" /> Katalog Produk ({m.products?.length || 0})
              </h3>
            </div>

            {m.products && m.products.length > 0 ? (
              <div className="products-grid reveal-stagger">
                {m.products.map((p, i) => (
                  <ProductCard 
                    key={p.id || i} 
                    p={{ 
                      ...p, 
                      msmeName: m.name, 
                      msmeId: m.id, 
                      cat: m.cat, 
                      status: m.status,
                      rating: p.rating || 5.0,
                      views: p.views || 100
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 20px', border: '1px dashed var(--line)', borderRadius: '8px', color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
                Belum ada produk yang didaftarkan untuk UMKM ini.
              </div>
            )}
          </div>

          {/* CERTS & AWARDS */}
          {m.certs && m.certs.length > 0 && (
            <div className="panel reveal">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AwardIcon style={{ color: 'var(--soil)' }} /> Sertifikasi & Izin Usaha
              </h3>
              <div className="cert-list">
                {m.certs.map((c, index) => (
                  <div className="cert-item" key={index} style={{ padding: '8px 12px', background: 'var(--soil-soft)', borderRadius: '8px', border: '1px solid var(--line)' }}>
                    <CheckIcon style={{ color: 'var(--forest-light)', marginTop: '2px' }} />
                    <span style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.88rem' }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR COLUMN */}
        <div className="reveal reveal-right">
          {/* LOCATION MAP */}
          <div className="panel" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PinIcon style={{ color: 'var(--soil)' }} /> Lokasi & Peta Gps
            </h3>
            
            <div className="map-box" style={{ height: '230px', minHeight: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--line)', marginBottom: '14px', position: 'relative' }}>
              <iframe
                title={`Peta Lokasi ${m.name}`}
                width="100%"
                height="100%"
                style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${lat},${lng}&hl=id&z=15&output=embed`}
              />
            </div>

            <p style={{ marginBottom: '12px', fontSize: '0.88rem', color: 'var(--ink)', lineHeight: '1.5' }}>
              <b>Alamat:</b> {m.addr}
            </p>
            
            <div style={{ marginBottom: '16px', padding: '10px 12px', background: 'var(--sand)', border: '1px solid var(--line)', borderRadius: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                <span style={{ color: 'var(--ink-soft)' }}>Latitude</span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>{lat}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                <span style={{ color: 'var(--ink-soft)' }}>Longitude</span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>{lng}</span>
              </div>
            </div>

            <a
              className="btn btn-soil"
              style={{ width: '100%', padding: '10px 14px', justifyContent: 'center', boxSizing: 'border-box', display: 'flex', alignItems: 'center', fontSize: '0.84rem' }}
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <RouteIcon style={{ marginRight: '6px', flexShrink: 0 }} />
              <span>Petunjuk Arah Google Maps</span>
            </a>
          </div>

          {/* CONTACT INFO */}
          <div className="panel">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '14px' }}>
              📞 Kontak & Media Sosial
            </h3>
            
            {contacts.length > 0 ? (
              <div className="contact-list">
                {contacts.map((c, index) => (
                  <div className="contact-item" key={index}>
                    <div className="ic">{getContactIcon(c.ic)}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <span className="lbl">{c.lbl}</span>
                      {c.href ? (
                        <a className="val" href={c.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--forest)', wordBreak: 'break-all' }}>
                          {c.val}
                        </a>
                      ) : (
                        <span className="val" style={{ wordBreak: 'break-all' }}>{c.val}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.84rem', color: 'var(--ink-soft)', margin: 0 }}>
                Belum ada informasi kontak tambahan.
              </p>
            )}

            {m.wa && (
              <a
                href={`https://wa.me/${m.wa}?text=${encodeURIComponent(`Halo ${m.name}, saya ingin bertanya tentang produk dan layanan usaha Anda.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  width: '100%',
                  marginTop: '16px',
                  backgroundColor: '#25D366',
                  borderColor: '#25D366',
                  color: '#fff',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  fontSize: '0.86rem',
                  fontWeight: 600
                }}
              >
                <PhoneIcon style={{ width: '16px', height: '16px' }} />
                <span>Hubungi via WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <WAFloatButton waNumber={m.wa} />
    </main>
  );
}