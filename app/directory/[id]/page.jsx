import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MSMES } from '../../../src/data/msmes';
import { PhotoSVG, ProductSVG } from '../../../src/components/DynamicSVGs';
import DetailActions from '../../../src/components/DetailActions';
import WAFloatButton from '../../../src/components/WAFloatButton';
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
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Beranda</Link>
          <span className="sep">/</span>
          <Link href="/directory">UMKM Desa</Link>
          <span className="sep">/</span>
          <span className="current">{m.name}</span>
        </div>
      </div>

      <div className="wrap section" style={{ paddingTop: '8px' }}>
        {/* HERO IMAGE */}
        <div className="detail-hero">
          <PhotoSVG cat={m.cat} seed={m.id} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* GALLERY STRIP */}
        <div className="gallery-strip">
          {gallery.map((g, index) => (
            <div key={index} className="thumb">
              <PhotoSVG cat={m.cat} seed={g} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* TOP META & ACTION BUTTONS */}
        <div className="detail-top">
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
          <div>
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
                <div className="info-row">
                  <span className="k">Jam Operasional</span>
                  <span className="v">{m.hours}</span>
                </div>
                <div className="info-row">
                  <span className="k">Status</span>
                  <span className="v">{m.status === 'inactive' ? 'Tidak Aktif' : 'Aktif'}</span>
                </div>
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="panel">
              <h3>Produk Unggulan</h3>
              <div className="products-grid">
                {m.products.map((p, i) => (
                  <div className="product-card" key={i}>
                    <div className="product-photo">
                      <ProductSVG cat={m.cat} seed={m.id * 3 + i} />
                    </div>
                    <div className="product-body">
                      <div className="pname">{p.name}</div>
                      <div className="pdesc">{p.desc}</div>
                      <div className="pprice">{p.price}</div>
                    </div>
                  </div>
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

          <div>
            {/* LOCATION MAP */}
            <div className="panel">
              <h3>
                <PinIcon style={{ marginRight: '8px' }} /> Lokasi
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
              <p style={{ marginBottom: '14px' }}>{m.addr}</p>
              <a
                className="btn"
                style={{ width: '100%' }}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.addr)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <RouteIcon style={{ marginRight: '8px' }} /> Dapatkan Petunjuk Arah
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
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <WAFloatButton waNumber={m.wa} />
    </main>
  );
}
