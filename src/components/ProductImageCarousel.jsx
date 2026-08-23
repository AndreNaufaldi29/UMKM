'use client';

import React, { useState } from 'react';
import { withBasePath } from '../utils/basePath';
import { ProductSVG } from './DynamicSVGs';
import { ChevronLeftIcon, ChevronRightIcon, MaximizeIcon } from './Icons';
import ImageLightboxModal from './ImageLightboxModal';

export default function ProductImageCarousel({ images = [], name = '', cat = '', price = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const imageList = Array.isArray(images) && images.length > 0 ? images.filter(Boolean) : [];
  const baseSeed = name ? name.length + (price || 10) : 42;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handleOpenLightbox = (e) => {
    if (e) e.stopPropagation();
    setIsLightboxOpen(true);
  };

  const currentImage = imageList[currentIndex];
  const currentSrc = currentImage ? withBasePath(currentImage) : '';

  return (
    <div className="product-carousel-wrapper">
      {/* MAIN DISPLAY PHOTO */}
      <div 
        className="panel detail-photo-panel product-gallery-main" 
        onClick={handleOpenLightbox}
        title="Klik untuk melihat foto ukuran penuh"
        style={{ 
          padding: 0, 
          overflow: 'hidden', 
          aspectRatio: '4/3', 
          position: 'relative',
          borderRadius: 'var(--radius)',
          cursor: 'zoom-in',
          backgroundColor: '#151c19',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {currentImage ? (
          <>
            {/* AMBIENT BLURRED BACKDROP */}
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

            {/* VIGNETTE OVERLAY */}
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

            {/* FOREGROUND SHARP FULL IMAGE (Uncropped) */}
            <img
              src={currentSrc}
              alt={`${name} - foto ${currentIndex + 1}`}
              style={{ 
                position: 'relative',
                zIndex: 3,
                width: '100%', 
                height: '100%', 
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.35))'
              }}
            />
          </>
        ) : (
          <div style={{ position: 'relative', zIndex: 3, width: '100%', height: '100%' }}>
            <ProductSVG 
              cat={cat} 
              seed={baseSeed} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
        )}

        {/* EXPAND BUTTON */}
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

        {/* CAROUSEL CONTROLS IF MORE THAN 1 IMAGE */}
        {imageList.length > 1 && (
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
                transition: 'all 0.2s ease'
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
                transition: 'all 0.2s ease'
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
              {currentIndex + 1} / {imageList.length}
            </div>
          </>
        )}
      </div>

      {/* THUMBNAIL GALLERY STRIP IF MORE THAN 1 IMAGE */}
      {imageList.length > 1 && (
        <div className="gallery-strip">
          {imageList.map((img, idx) => (
            <div
              key={idx}
              className={`thumb ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              title={`${name} - Foto ${idx + 1}`}
            >
              <img
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                src={withBasePath(img)}
                alt={`${name} thumbnail ${idx + 1}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={imageList}
        initialIndex={currentIndex}
        title={name}
        subtitle="Galeri Produk"
        cat={cat}
        fallbackSeed={baseSeed}
      />
    </div>
  );
}