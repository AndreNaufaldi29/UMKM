import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MSMES } from '../../../src/data/msmes';
import { PhotoSVG, ProductSVG } from '../../../src/components/DynamicSVGs';
import DetailActions from '../../../src/components/DetailActions';
import WAFloatButton from '../../../src/components/WAFloatButton';
import ProductCard from '../../../src/components/ProductCard';
import { formatRupiah } from '../../../src/utils/formatter';
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
} from '../../../src/components/Icons';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const m = MSMES.find((x) => x.id === Number(id));
  if (!m) {
    return {
      title: 'UMKM Tidak Ditemukan - Desa Sukamaju',
      description: 'Detail profil usaha tidak ditemukan.',
    };
  }
  return {
    title: `${m.name} - Katalog UMKM Desa Sukamaju`,
    description: m.desc,
  };
}

export default async function DetailPage({ params }) {
  const { id } = await params;
  const m = MSMES.find((x) => x.id === Number(id));

  if (!m) {
    notFound();
  }

  const gallery = [m.id, m.id + 10, m.id + 20, m.id + 30];

  const contacts = [
    m.wa && { ic: 'wa', lbl: 'WhatsApp', val: '+' + m.wa, href: `https://wa.me/${m.wa}` },
    m.phone && { ic: 'phone', lbl: 'Telepon', val: m.phone },
    m.email && { ic: 'email', lbl: 'Email', val: m.email, href: `mailto:${m.email}` },
    m.web && { ic: 'web', lbl: 'Website', val: m.web, href: m.web.startsWith('http') ? m.web : `https://${m.web}` },
    m.fb && { ic: 'fb', lbl: 'Facebook', val: m.fb, href: `https://facebook.com/${m.fb}` },
    m.ig && { ic: 'ig', lbl: 'Instagram', val: '@' + m.ig, href: `https://instagram.com/${m.ig}` },
    m.tiktok && { ic: 'tiktok', lbl: 'TikTok', val: '@' + m.tiktok, href: `https://tiktok.com/@${m.tiktok}` },
  ].filter(Boolean);

  const getContactIcon = (icType) => {
    switch (icType) {
      case 'wa':
      case 'phone':
        return <PhoneIcon />;
      case 'email':
        return <MailIcon />;
      case 'web':
        return <GlobeIcon />;
      case 'fb':
        return <FbIcon />;
      case 'ig':
        return <IgIcon />;
      case 'tiktok':
        return <TiktokIcon />;
      default:
        return null;
    }
  };

  return (
    <main>
      {/* BREADCRUMB */}
      <div className="wrap reveal reveal-left">
        <div className="breadcrumb">
          <Link href="/">Beranda</Link>
          <span className="sep">/</span>
          <Link href="/umkm">UMKM Desa</Link>
          <span className="sep">/</span>
          <span className="current">{m.name}</span>
        </div>
      </div>

      <div className="wrap section" style={{ paddingTop: '8px' }}>
        {/* HERO IMAGE */}
        <div className="detail-hero reveal reveal-scale">
          <PhotoSVG cat={m.cat} seed={m.id} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* GALLERY STRIP */}
        <div className="gallery-strip reveal reveal-scale">
          {gallery.map((g, index) => (
            <div key={index} className="thumb">
              <PhotoSVG cat={m.cat} seed={g} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* TOP META & ACTION BUTTONS */}
        <div className="detail-top reveal reveal-left">
          <div>
            <h1>{m.name}</h1>
            <div className="detail-meta">
              <Link href={`/products?cat=${encodeURIComponent(m.cat)}`} className="badge" style={{ cursor: 'pointer' }}>
                <CategoryIcon cat={m.cat} />
                <span style={{ marginLeft: '6px' }}>{m.cat}</span>
              </Link>
              <span className="badge sky">
                <PinIcon />
                <span style={{ marginLeft: '6px' }}>{m.dusun}</span>
              </span>
              <span className="badge soil">
                <CheckIcon />
                <span style={{ marginLeft: '6px' }}>{m.status === 'inactive' ? 'Tidak Aktif' : 'Aktif Beroperasi'}</span>
              </span>
            </div>
          </div>
          <DetailActions name={m.name} wa={m.wa} />
        </div>

        {/* MAIN PANEL AND SIDEBAR */}
        <div className="detail-layout" style={{ marginTop: '20px' }}>
          <div className="reveal reveal-left">
            {/* ABOUT */}
            <div className="panel">
              <h3>Tentang Usaha</h3>
              <p>{m.desc}</p>
              <div style={{ marginTop: '16px' }}>
                <div className="info-row">
                  <span className="k">Pemilik</span>
                  <span className="v">{m.owner}</span>
                </div>
                <div className="info-row">
                  <span className="k">Tahun Berdiri</span>
                  <span className="v mono">{m.est}</span>
                </div>
                {m.hours.includes('–') ? (
                  <>
                    <div className="info-row">
                      <span className="k">Jam Buka</span>
                      <span className="v">{m.hours.split('–')[0].trim()}</span>
                    </div>
                    <div className="info-row">
                      <span className="k">Jam Tutup</span>
                      <span className="v">{m.hours.split('–')[1].trim()}</span>
                    </div>
                  </>
                ) : m.hours.includes('/') ? (
                  <>
                    <div className="info-row">
                      <span className="k">Buka (Check-in)</span>
                      <span className="v">{m.hours.split('/')[0].replace('Check-in', '').trim()}</span>
                    </div>
                    <div className="info-row">
                      <span className="k">Tutup (Check-out)</span>
                      <span className="v">{m.hours.split('/')[1].replace('Check-out', '').trim()}</span>
                    </div>
                  </>
                ) : (
                  <div className="info-row">
                    <span className="k">Status Jam Operasional</span>
                    <span className="v">{m.hours}</span>
                  </div>
                )}
                <div className="info-row">
                  <span className="k">Status</span>
                  <span className="v">{m.status === 'inactive' ? 'Tidak Aktif' : 'Aktif'}</span>
                </div>
              </div>
            </div>

            {/* BRIEF HISTORY */}
            <div className="panel">
              <h3>Sejarah Singkat</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.94rem', lineHeight: '1.6' }}>
                {`Didirikan oleh ${m.owner} pada tahun ${m.est}, ${m.name} bermula dari industri rumah tangga kecil yang didasari keinginan luhur untuk memajukan potensi daerah. Berkat konsistensi dalam mempertahankan mutu produk ${m.cat} pilihan, kini usaha ini telah berkembang pesat sebagai salah satu penyedia produk lokal tepercaya di wilayah ${m.dusun}, Desa Sukamaju, sekaligus berkontribusi aktif dalam meningkatkan taraf hidup warga dan memberdayakan para pemuda desa.`}
              </p>
            </div>

            {/* PRODUCTS */}
            <div className="panel">
              <h3>Daftar Produk</h3>
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
            </div>

            {/* CERTS & AWARDS */}
            {m.certs && m.certs.length > 0 && (
              <div className="panel">
                <h3>
                  <AwardIcon style={{ marginRight: '8px' }} /> Sertifikasi & Penghargaan
                </h3>
                <div className="cert-list">
                  {m.certs.map((c, index) => (
                    <div className="cert-item" key={index}>
                      <CheckIcon style={{ color: 'var(--forest-light)' }} />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="reveal reveal-right">
            {/* LOCATION MAP */}
            <div className="panel">
              <h3>
                <PinIcon style={{ marginRight: '8px' }} /> Lokasi & Koordinat
              </h3>
              <div className="map-box" style={{ height: '250px', minHeight: '220px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--line)', marginBottom: '14px', position: 'relative' }}>
                <iframe
                  title={`Peta Lokasi ${m.name}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${(-7.2504 - (m.id * 0.0011)).toFixed(6)},${(110.1502 + (m.id * 0.0013)).toFixed(6)}&hl=id&z=15&output=embed`}
                />
              </div>
              <p style={{ marginBottom: '14px', fontSize: '0.9rem', color: 'var(--ink)' }}>
                <b>Alamat Lengkap:</b> {m.addr}
              </p>
              
              <div style={{ marginBottom: '14px', padding: '10px 12px', background: 'var(--sand)', borderRadius: '8px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: 'var(--ink-soft)' }}>Latitude</span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>{(-7.2504 - (m.id * 0.0011)).toFixed(6)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: 'var(--ink-soft)' }}>Longitude</span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>{(110.1502 + (m.id * 0.0013)).toFixed(6)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: 'var(--ink-soft)' }}>Altitude (Ketinggian)</span>
                  <span style={{ fontWeight: 600 }}>{(450 + (m.id * 8))} mdpl</span>
                </div>
              </div>

              <a
                className="btn btn-soil"
                style={{ width: '100%', padding: '12px 16px', justifyContent: 'center', boxSizing: 'border-box', display: 'flex', alignItems: 'center', fontSize: '0.86rem' }}
                href={`https://www.google.com/maps/search/?api=1&query=${(-7.2504 - (m.id * 0.0011)).toFixed(6)},${(110.1502 + (m.id * 0.0013)).toFixed(6)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <RouteIcon style={{ marginRight: '8px', flexShrink: 0 }} />
                <span>Buka Arah di Google Maps</span>
              </a>
            </div>

            {/* CONTACT INFO */}
            <div className="panel">
              <h3>Kontak</h3>
              <div className="contact-list">
                {contacts.map((c, index) => (
                  <div className="contact-item" key={index}>
                    <div className="ic">{getContactIcon(c.ic)}</div>
                    <div>
                      <span className="lbl">{c.lbl}</span>
                      {c.href ? (
                        <a className="val" href={c.href} target="_blank" rel="noopener noreferrer">
                          {c.val}
                        </a>
                      ) : (
                        <span className="val">{c.val}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
                    gap: '8px'
                  }}
                >
                  <PhoneIcon style={{ width: '16px', height: '16px' }} />
                  <span>Hubungi via WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <WAFloatButton waNumber={m.wa} />
    </main>
  );
}
