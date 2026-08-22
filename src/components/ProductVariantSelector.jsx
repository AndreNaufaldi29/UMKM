'use client';

import React, { useState, useEffect } from 'react';
import { PhoneIcon } from './Icons';

export default function ProductVariantSelector({ variants = [], productName, msmeName, waNumber, status }) {
  const hasVariants = Array.isArray(variants) && variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState(hasVariants ? variants[0] : '');

  useEffect(() => {
    if (hasVariants && (!selectedVariant || !variants.includes(selectedVariant))) {
      setSelectedVariant(variants[0]);
    }
  }, [variants, hasVariants]);

  const message = hasVariants && selectedVariant
    ? `Halo, saya tertarik untuk membeli produk "${productName}" (Varian: ${selectedVariant}) dari toko "${msmeName}". Apakah stok varian ini masih tersedia?`
    : `Halo, saya tertarik untuk membeli produk "${productName}" dari toko "${msmeName}". Apakah stok produk ini masih tersedia?`;

  const waUrl = waNumber && status !== 'inactive'
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* VARIANTS LIST */}
      {hasVariants && (
        <div>
          <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-soft)', marginBottom: '10px' }}>
            Pilihan Varian: <b style={{ color: 'var(--forest)', textTransform: 'none' }}>{selectedVariant}</b>
          </h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {variants.map((v, idx) => {
              const isSelected = selectedVariant === v;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedVariant(v)}
                  className={`variant-chip ${isSelected ? 'active' : ''}`}
                  style={{
                    padding: '9px 16px',
                    border: isSelected ? '2px solid var(--forest)' : '1px solid var(--line)',
                    background: isSelected ? 'var(--forest-soft)' : 'var(--paper)',
                    color: isSelected ? 'var(--forest)' : 'var(--ink-soft)',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    outline: 'none',
                    boxShadow: isSelected ? '0 2px 8px rgba(30, 75, 59, 0.15)' : 'none'
                  }}
                >
                  <span>{v}</span>
                  {isSelected && <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
        {waUrl ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-soil"
            style={{
              flex: '1 1 200px',
              padding: '14px 22px',
              justifyContent: 'center',
              backgroundColor: '#25D366',
              borderColor: '#25D366',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.94rem'
            }}
          >
            <PhoneIcon style={{ width: '18px', height: '18px' }} />
            <span>{hasVariants ? 'Beli Varian Ini via WhatsApp' : 'Beli Sekarang via WhatsApp'}</span>
          </a>
        ) : (
          <div
            className="btn btn-outline"
            style={{ flex: '1 1 200px', cursor: 'not-allowed', opacity: 0.6, justifyContent: 'center' }}
          >
            Toko Tutup Sementara
          </div>
        )}
      </div>
    </div>
  );
}