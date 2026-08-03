import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MSMES } from '../../../src/data/msmes';
import { PhotoSVG, ProductSVG } from '../../../src/components/DynamicSVGs';
import DetailActions from '../../../src/components/DetailActions';
import WAFloatButton from '../../../src/components/WAFloatButton';
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
              <span className="badge">
                <CategoryIcon cat={m.cat} />
                <span style={{ marginLeft: '6px' }}>{m.cat}</span>
              </span>
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
                  <Link href={`/produk/${p.id.replace('p', '').replace('_', '')}`} key={i} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="product-card card" style={{ height: '100%', cursor: 'pointer' }}>
                      <div className="card-photo">
                        <ProductSVG cat={m.cat} seed={m.id * 3 + i} />
                      </div>
                      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 150px)', justifyContent: 'space-between' }}>
                        <div>
                          <div className="pname" style={{ fontWeight: 700, fontSize: '0.92rem' }}>{p.name}</div>
                          <div className="pdesc" style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', marginTop: '4px', minHeight: '36px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                          <div className="pprice" style={{ fontWeight: 700, color: 'var(--soil)', fontFamily: 'IBM Plex Mono, monospace' }}>{formatRupiah(p.price)}{p.unit ? `/${p.unit}` : ''}</div>
                          {p.rating && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.78rem', color: 'var(--soil)', fontWeight: 600 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" style={{ color: '#FBBF24' }}>
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <span>{p.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
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
              <div className="map-box">
                <svg viewBox="0 0 320 180" style={{ width: '100%', height: '100%', background: 'var(--forest-soft)' }}>
                  <path d="M0,140 L60,120 L130,132 L200,105 L260,125 L320,110 L320,180 L0,180 Z" fill="var(--forest-light)" opacity=".5" />
                  <circle cx="160" cy="85" r="9" fill="var(--soil)" />
                  <path d="M160 85 v-22" stroke="var(--soil)" strokeWidth="3" strokeLinecap="round" />
                  <text x="160" y="45" textAnchor="middle" fontSize="10" fill="var(--ink-soft)" fontFamily="IBM Plex Mono, monospace">
                    Peta Lokasi (Google Maps)
                  </text>
                </svg>
              </div>
              <p style={{ marginBottom: '14px', fontSize: '0.9rem' }}>{m.addr}</p>
              
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
                className="btn"
                style={{ width: '100%', justifyContent: 'center' }}
                href={`https://www.google.com/maps/search/?api=1&query=${(-7.2504 - (m.id * 0.0011)).toFixed(6)},${(110.1502 + (m.id * 0.0013)).toFixed(6)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <RouteIcon style={{ marginRight: '8px' }} /> Buka di Google Maps
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
