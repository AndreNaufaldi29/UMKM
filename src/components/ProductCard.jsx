'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProductSVG } from './DynamicSVGs';
import { CategoryIcon, StarIcon, EyeIcon, PhoneIcon } from './Icons';
import { formatRupiah } from '../utils/formatter';

export default function ProductCard({ p }) {
  const router = useRouter();
  const productUrl = `/produk/${p.id.replace('p', '').replace('_', '')}`;
  const waUrl = p.wa
    ? `https://wa.me/${p.wa}?text=${encodeURIComponent(
        `Halo, saya tertarik dengan produk "${p.name}" dari UMKM "${p.msmeName}".`
      )}`
    : null;

  const handleCardClick = (e) => {
    router.push(productUrl);
  };

  const handleOwnerClick = (e) => {
    e.stopPropagation();
    router.push(`/umkm/${p.msmeId}`);
  };

  return (
    <div 
      className="product-catalog-card card" 
      onClick={handleCardClick}
      style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
    >
      <div className="card-photo">
        <ProductSVG cat={p.cat} seed={p.name.length + p.price} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div 
          className="card-cat"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/products?cat=${encodeURIComponent(p.cat)}`);
          }}
          style={{ cursor: 'pointer' }}
        >
          <CategoryIcon cat={p.cat} />
          <span style={{ marginLeft: '4px' }}>{p.cat}</span>
        </div>
        {p.status === 'inactive' && (
          <div className="card-status inactive">Tutup</div>
        )}
      </div>

      <div className="card-body">
        <div style={{ display: 'block' }}>
          <h3 className="product-title" style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink)' }}>
            {p.name}
          </h3>
          <span 
            className="product-owner"
            onClick={handleOwnerClick}
            style={{ display: 'inline-block', fontSize: '0.78rem', color: 'var(--forest-light)', fontWeight: 600, marginTop: '2px', cursor: 'pointer' }}
          >
            {p.msmeName}
          </span>
        </div>
        
        <p className="product-desc" style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', margin: '6px 0 12px', minHeight: '36px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {p.desc}
        </p>

        {/* METRICS */}
        <div className="product-metrics" style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.74rem', color: 'var(--ink-soft)', borderBottom: '1px dashed var(--line)', paddingBottom: '10px', marginBottom: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }} title="Rating">
            <StarIcon style={{ color: '#FBBF24' }} />
            <b style={{ color: 'var(--ink)' }}>{p.rating.toFixed(1)}</b>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }} title="Dilihat">
            <EyeIcon />
            <span>{p.views}</span>
          </span>
        </div>

        <div className="card-foot" style={{ paddingTop: 0, gap: '8px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Harga</span>
            <span className="pprice" style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--soil)', fontFamily: 'IBM Plex Mono, monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {formatRupiah(p.price)}
              {p.unit && <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--ink-soft)' }}>/{p.unit}</span>}
            </span>
          </div>
          
          {waUrl && p.status !== 'inactive' ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-soil"
              style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <PhoneIcon width="12" height="12" />
              Beli
            </a>
          ) : (
            <span
              className="btn btn-outline"
              style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}
            >
              Detail
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
