'use client';

import React, { useState } from 'react';
import { withBasePath } from '../utils/basePath';
import { ProductSVG } from './DynamicSVGs';
import { ChevronLeftIcon, ChevronRightIcon, MaximizeIcon } from './Icons';
import ImageLightboxModal from './ImageLightboxModal';

export default function ProductGallery({ images = [], imageUrl = '', name = '', cat = '', price = 0, id = 1 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // 1. Helper to extract array of image URLs from props
  const getProcessedImages = () => {
    let list = [];
    if (Array.isArray(images) && images.length > 0) {
      list = images.filter(Boolean);
    } else if (imageUrl) {
      if (typeof imageUrl === 'string') {
        const trimmed = imageUrl.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) list = parsed.filter(Boolean);
          } catch (e) {
            // fallback
          }
        }
        if (list.length === 0) {
          list = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
    }
    return list;
  };

  const rawImages = getProcessedImages();

  // 2. Build gallery items — hanya tampilkan gambar yang benar-benar ada.
  // Jika tidak ada gambar sama sekali, tampilkan 1 SVG fallback saja.
  const baseSeed = name ? name.length + (price || 10) : 42;

  let galleryItems = [];

  if (rawImages.length > 0) {
    galleryItems = rawImages.map((src) => ({ type: 'image', src }));
  } else {
    galleryItems = [{ type: 'svg', seed: baseSeed }];
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  };

  const handleOpenLightbox = (e) => {
    if (e) e.stopPropagation();
    setIsLightboxOpen(true);
  };

  const currentItem = galleryItems[currentIndex] || galleryItems[0];
  const isCurrentImage = currentItem?.type === 'image' && !failedImages[currentIndex];
  const currentSrc = isCurrentImage ? withBasePath(currentItem.src) : '';

  return (
    <div className="product-gallery-wrapper">
      {/* MAIN DISPLAY PHOTO CONTAINER */}
      <div 
        className="panel detail-photo-panel reveal reveal-left product-gallery-main" 
        onClick={handleOpenLightbox}
        title="Klik untuk melihat foto ukuran penuh"
        style={{ 
          padding: 0, 
          overflow: 'hidden', 
          aspectRatio: '4/3', 
          position: 'relative',
          borderRadius: 'var(--radius)',
          marginBottom: '16px',
          cursor: 'zoom-in',
          backgroundColor: '#151c19',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isCurrentImage ? (
          <>
            {/* AMBIENT BLURRED BACKDROP (Fills container without leaving empty gaps) */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '-12px',
                backgroundImage: `url(${currentSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(22px) brightness(0.48) saturate(1.3)',
                opacity: 0.85,
                transform: 'scale(1.15)',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />

            {/* SUBTLE VIGNETTE / GLASS OVERLAY */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)',
                pointerEvents: 'none',
                zIndex: 2
              }}
            />

            {/* FOREGROUND SHARP FULL IMAGE (Uncropped with object-fit: contain) */}
            <img
              src={currentSrc}
              alt={`${name} - Foto ${currentIndex + 1}`}
              style={{ 
                position: 'relative',
                zIndex: 3,
                width: '100%', 
                height: '100%', 
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
                filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.35))'
              }}
              onError={() => setFailedImages((prev) => ({ ...prev, [currentIndex]: true }))}
            />
          </>
        ) : (
          <div style={{ position: 'relative', zIndex: 3, width: '100%', height: '100%' }}>
            <ProductSVG 
              cat={cat} 
              seed={currentItem?.type === 'svg' ? currentItem.seed : baseSeed + currentIndex} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
        )}

        {/* FULLSCREEN / ZOOM QUICK BUTTON */}
        <button
          type="button"
          onClick={handleOpenLightbox}
          className="gallery-expand-btn"
          aria-label="Lihat Ukuran Penuh"
          title="Lihat Ukuran Penuh"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '7px 12px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            zIndex: 6,
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.35)'
          }}
        >
          <MaximizeIcon style={{ width: '14px', height: '14px' }} />
          <span>Lihat Penuh</span>
        </button>

        {/* CAROUSEL ARROW CONTROLS */}
        {galleryItems.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="carousel-arrow carousel-prev"
              aria-label="Gambar sebelumnya"
              title="Gambar sebelumnya"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 6,
                backdropFilter: 'blur(6px)',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <ChevronLeftIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="carousel-arrow carousel-next"
              aria-label="Gambar selanjutnya"
              title="Gambar selanjutnya"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 6,
                backdropFilter: 'blur(6px)',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <ChevronRightIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
            </button>

            {/* COUNTER BADGE */}
            <div 
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(6px)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.76rem',
                fontWeight: 600,
                fontFamily: 'IBM Plex Mono, monospace',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                zIndex: 6
              }}
            >
              {currentIndex + 1} / {galleryItems.length}
            </div>
          </>
        )}
      </div>

      {/* THUMBNAIL GALLERY STRIP */}
      {galleryItems.length > 1 && (
        <div className="gallery-strip reveal reveal-left">
          {galleryItems.map((item, idx) => {
            const isActive = idx === currentIndex;
            const isFailed = failedImages[idx];
            return (
              <div
                key={idx}
                className={`thumb ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                title={`${name} - Foto ${idx + 1}`}
              >
                {item.type === 'image' && !isFailed ? (
                  <img
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    src={withBasePath(item.src)}
                    alt={`${name} thumbnail ${idx + 1}`}
                    onError={() => setFailedImages((prev) => ({ ...prev, [idx]: true }))}
                  />
                ) : (
                  <ProductSVG 
                    cat={cat} 
                    seed={item.type === 'svg' ? item.seed : baseSeed + idx} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={galleryItems}
        initialIndex={currentIndex}
        title={name}
        subtitle="Galeri Produk"
        cat={cat}
        fallbackSeed={baseSeed}
      />
    </div>
  );
}