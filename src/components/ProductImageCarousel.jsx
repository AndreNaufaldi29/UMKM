'use client';

import React, { useState } from 'react';
import { withBasePath } from '../utils/basePath';
import { ProductSVG } from './DynamicSVGs';

export default function ProductImageCarousel({ images = [], name = '', cat = '', price = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageList = Array.isArray(images) && images.length > 0 ? images.filter(Boolean) : [];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const currentImage = imageList[currentIndex];


  return (
    <div className="product-carousel-wrapper">
      {/* MAIN DISPLAY PHOTO */}
      <div 
        className="panel detail-photo-panel" 
        style={{ 
          padding: 0, 
          overflow: 'hidden', 
          aspectRatio: '4/3', 
          position: 'relative',
          borderRadius: 'var(--radius)'
        }}
      >
        {currentImage ? (
          <img
            src={withBasePath(currentImage)}
            alt={`${name} - foto ${currentIndex + 1}`}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'opacity 0.3s ease'
            }}
          />
        ) : (
          <ProductSVG 
            cat={cat} 
            seed={name.length + price} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        )}

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
                background: 'rgba(0, 0, 0, 0.55)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease',
                fontSize: '1.2rem',
                lineHeight: 1
              }}
            >
              &lite;
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
                transition: 'all 0.2s ease',
                fontSize: '1.2rem',
                lineHeight: 1
              }}
            >
              &gt;
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
              {currentIndex + 1} / {imageList.length}
            </div>
          </>
        )}
      </div>

      {/* THUMBNAIL GALLERY STRIP IF MORE THAN 1 IMAGE */}
      {imageList.length > 1 && (
        <div 
          className="gallery-strip" 
          style={{ 
            display: 'flex',
            gap: '10px',
            marginTop: '12px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}
        >
          {imageList.map((img, idx) => (
            <div
              key={idx}
              className={`thumb ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '80px',
                height: '60px',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0,
                cursor: 'pointer',
                border: idx === currentIndex ? '2px solid var(--forest)' : '1px solid var(--line)',
                boxShadow: idx === currentIndex ? '0 4px 12px rgba(47, 107, 82, 0.35)' : 'none',
                opacity: idx === currentIndex ? 1 : 0.7,
                transition: 'all 0.2s ease'
              }}
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
    </div>
  );
}
