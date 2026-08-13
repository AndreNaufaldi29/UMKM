'use client';

import React, { useState } from 'react';
import { withBasePath } from '../utils/basePath';
import { ProductSVG } from './DynamicSVGs';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

export default function ProductGallery({ images = [], imageUrl = '', name = '', cat = '', price = 0, id = 1 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // 2. Build gallery items array (minimum 4 items to mirror UMKM detail gallery strip)
  const baseSeed = name ? name.length + (price || 10) : 42;
  const seeds = [baseSeed, baseSeed + 10, baseSeed + 20, baseSeed + 30];

  let galleryItems = [];

  if (rawImages.length >= 4) {
    galleryItems = rawImages.map((src) => ({ type: 'image', src }));
  } else if (rawImages.length > 0) {
    // Fill up to 4 items with seeds/variations if less than 4 real images
    const realItems = rawImages.map((src) => ({ type: 'image', src }));
    const fillSeeds = seeds.slice(rawImages.length).map((seed) => ({ type: 'svg', seed }));
    galleryItems = [...realItems, ...fillSeeds];
  } else {
    // Default 4 SVG seeds if no images available
    galleryItems = seeds.map((seed) => ({ type: 'svg', seed }));
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  };

  const currentItem = galleryItems[currentIndex] || galleryItems[0];

  return (
    <div className="product-gallery-wrapper">
      {/* MAIN DISPLAY PHOTO */}
      <div 
        className="panel detail-photo-panel reveal reveal-left" 
        style={{ 
          padding: 0, 
          overflow: 'hidden', 
          aspectRatio: '4/3', 
          position: 'relative',
          borderRadius: 'var(--radius)',
          marginBottom: '16px'
        }}
      >
        {currentItem.type === 'image' ? (
          <img
            src={withBasePath(currentItem.src)}
            alt={`${name} - Foto ${currentIndex + 1}`}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'opacity 0.3s ease, transform 0.4s ease'
            }}
          />
        ) : (
          <ProductSVG 
            cat={cat} 
            seed={currentItem.seed} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        )}

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
                background: 'rgba(0, 0, 0, 0.55)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
                backdropFilter: 'blur(4px)',
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
                background: 'rgba(0, 0, 0, 0.55)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
                backdropFilter: 'blur(4px)',
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
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(4px)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.76rem',
                fontWeight: 600,
                fontFamily: 'IBM Plex Mono, monospace',
                zIndex: 5
              }}
            >
              {currentIndex + 1} / {galleryItems.length}
            </div>
          </>
        )}
      </div>

      {/* THUMBNAIL GALLERY STRIP (Identical to UMKM Detail Gallery) */}
      <div className="gallery-strip reveal reveal-left" style={{ marginBottom: '20px' }}>
        {galleryItems.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={idx}
              className={`thumb ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '90px',
                height: '68px',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0,
                cursor: 'pointer',
                border: isActive ? '2px solid var(--forest)' : '1px solid var(--line)',
                boxShadow: isActive ? '0 4px 14px rgba(30, 75, 59, 0.35)' : 'none',
                opacity: isActive ? 1 : 0.75,
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {item.type === 'image' ? (
                <img
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  src={withBasePath(item.src)}
                  alt={`${name} thumbnail ${idx + 1}`}
                />
              ) : (
                <ProductSVG 
                  cat={cat} 
                  seed={item.seed} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}