'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductSVG } from './DynamicSVGs';
import { CategoryIcon, EyeIcon, PhoneIcon } from './Icons';
import { formatRupiah } from '../utils/formatter';
import { withBasePath } from '../utils/basePath';

export default function ProductCard({ p }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const productUrl = `/produk/${encodeURIComponent(p.id)}`;
  const waUrl = p.wa
    ? `https://wa.me/${p.wa}?text=${encodeURIComponent(
        `Halo, saya tertarik dengan produk "${p.name}" dari UMKM "${p.msmeName}".`
      )}`
    : null;

  const handleCardClick = () => {
    router.push(productUrl);
  };

  const handleOwnerClick = (e) => {
    e.stopPropagation();
    router.push(`/umkm/${p.msmeId}`);
  };

  const getPrimaryImage = (product) => {
    if (!product) return '';
    if (Array.isArray(product.images) && product.images.length > 0) {
      if (product.images[0]) return product.images[0];
    }
    const imgSrc = product.imageUrl;
    if (!imgSrc) return '';
    if (Array.isArray(imgSrc) && imgSrc.length > 0) {
      return imgSrc[0];
    }
    if (typeof imgSrc === 'string') {
      const trimmed = imgSrc.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
        } catch (e) {}
      }
      if (trimmed.includes(',')) {
        return trimmed.split(',')[0].trim();
      }
      return trimmed;
    }
    return '';
  };

  const primaryImage = getPrimaryImage(p);

  return (
    <div 
      className="product-catalog-card card" 
      onClick={handleCardClick}
      style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
    >
      <div className="card-photo">
        {primaryImage && !imgError ? (
          <img
            src={withBasePath(primaryImage)}
            alt={p.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <ProductSVG cat={p.cat} seed={p.name ? p.name.length + (p.price || 0) : 42} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div 
          className="card-cat"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/produk?cat=${encodeURIComponent(p.cat)}`);
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
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }} title="Dilihat">
            <EyeIcon />
            <span>{p.views || 0}</span>
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
