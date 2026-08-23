'use client';

import React, { useState } from 'react';
import { withBasePath } from '../utils/basePath';
import { PhotoSVG } from './DynamicSVGs';
import { MaximizeIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import ImageLightboxModal from './ImageLightboxModal';

export default function UMKMBannerImage({ imageUrl = '', images = [], name = '', cat = '', id = 1 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Helper to extract array of image URLs
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
  const baseSeed = name ? name.length + (id || 10) : 42;

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
    <div
      className="umkm-banner-container"
      onClick={handleOpenLightbox}
      title="Klik untuk melihat foto ukuran penuh"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: 'zoom-in',
        backgroundColor: '#1a221f'
      }}
    >
      {isCurrentImage ? (
        <>
          {/* AMBIENT BLURRED BACKDROP (fills 320px banner completely without black voids) */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '-16px',
              backgroundImage: `url(${currentSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(28px) brightness(0.42) saturate(1.35)',
              opacity: 0.9,
              transform: 'scale(1.15)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />

          {/* FOREGROUND SHARP FULL IMAGE (Uncropped with object-fit: contain) */}
          <img
            src={currentSrc}
            alt={name || 'Banner Profil UMKM'}
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
              filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.45))'
            }}
            onError={() => setFailedImages((prev) => ({ ...prev, [currentIndex]: true }))}
          />
        </>
      ) : (
        <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
          <PhotoSVG
            cat={cat}
            seed={currentItem?.seed || id}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* EXPAND / ZOOM BUTTON IN TOP-RIGHT OF BANNER */}
      <button
        type="button"
        onClick={handleOpenLightbox}
        className="banner-expand-btn"
        aria-label="Lihat Foto Penuh"
        title="Lihat Foto Penuh"
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          padding: '7px 14px',
          borderRadius: '999px',
          fontSize: '0.8rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
        }}
      >
        <MaximizeIcon style={{ width: '14px', height: '14px' }} />
        <span>Lihat Foto Penuh</span>
      </button>

      {/* MULTI-IMAGE CAROUSEL ARROWS IF MORE THAN 1 IMAGE */}
      {galleryItems.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto UMKM sebelumnya"
            title="Foto UMKM sebelumnya"
            style={{
              position: 'absolute',
              left: '14px',
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
              zIndex: 10,
              backdropFilter: 'blur(6px)',
              transition: 'all 0.2s ease'
            }}
          >
            <ChevronLeftIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Foto UMKM selanjutnya"
            title="Foto UMKM selanjutnya"
            style={{
              position: 'absolute',
              right: '14px',
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
              zIndex: 10,
              backdropFilter: 'blur(6px)',
              transition: 'all 0.2s ease'
            }}
          >
            <ChevronRightIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
          </button>

          {/* Counter badge */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(6px)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '0.76rem',
              fontWeight: 600,
              fontFamily: 'IBM Plex Mono, monospace',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              zIndex: 10
            }}
          >
            {currentIndex + 1} / {galleryItems.length}
          </div>
        </>
      )}

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={galleryItems}
        initialIndex={currentIndex}
        title={name}
        subtitle="Profil & Usaha UMKM"
        cat={cat}
        fallbackSeed={baseSeed}
      />
    </div>
  );
}