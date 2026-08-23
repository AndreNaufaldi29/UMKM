'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { withBasePath } from '../utils/basePath';
import { 
  XIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ZoomInIcon, 
  ZoomOutIcon, 
  ResetZoomIcon, 
  DownloadIcon 
} from './Icons';
import { ProductSVG } from './DynamicSVGs';

export default function ImageLightboxModal({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
  title = '',
  subtitle = '',
  cat = '',
  fallbackSeed = 42
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [failedImages, setFailedImages] = useState({});
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const imageContainerRef = useRef(null);

  // Normalize image items to objects { src, type }
  const normalizedImages = React.useMemo(() => {
    if (!images || images.length === 0) {
      return [{ type: 'svg', seed: fallbackSeed }];
    }
    return images.map((item, idx) => {
      if (typeof item === 'string') {
        return { type: 'image', src: item, seed: fallbackSeed + idx };
      }
      if (item && item.src) {
        return { type: 'image', src: item.src, seed: item.seed || fallbackSeed + idx };
      }
      if (item && item.type === 'svg') {
        return item;
      }
      return { type: 'svg', seed: fallbackSeed + idx };
    });
  }, [images, fallbackSeed]);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, normalizedImages.length - 1)));
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex, normalizedImages.length]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const resetTransform = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    resetTransform();
    setCurrentIndex((prev) => (prev === normalizedImages.length - 1 ? 0 : prev + 1));
  }, [normalizedImages.length, resetTransform]);

  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    resetTransform();
    setCurrentIndex((prev) => (prev === 0 ? normalizedImages.length - 1 : prev - 1));
  }, [normalizedImages.length, resetTransform]);

  const handleZoomIn = (e) => {
    if (e) e.stopPropagation();
    setZoom((prev) => Math.min(3.5, Number((prev + 0.35).toFixed(2))));
  };

  const handleZoomOut = (e) => {
    if (e) e.stopPropagation();
    setZoom((prev) => {
      const next = Math.max(1, Number((prev - 0.35).toFixed(2)));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = (e) => {
    if (e) e.stopPropagation();
    resetTransform();
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (zoom > 1) {
      resetTransform();
    } else {
      setZoom(2);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(3.5, Number((prev + 0.2).toFixed(2))));
    } else {
      setZoom((prev) => {
        const next = Math.max(1, Number((prev - 0.2).toFixed(2)));
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Drag / Pan handlers for zoomed state
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return;
    e.preventDefault();
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy
    });
  };

  const handleMouseUp = () => {
    if (isDragging) setIsDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen) return null;

  const currentItem = normalizedImages[currentIndex] || normalizedImages[0];
  const isCurrentImageFailed = failedImages[currentIndex];
  const isImage = currentItem?.type === 'image' && !isCurrentImageFailed;
  const currentSrc = isImage ? withBasePath(currentItem.src) : '';

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(6, 12, 10, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        animation: 'lightboxFadeIn 0.25s ease-out'
      }}
    >
      {/* AMBIENT BACKGROUND BLUR */}
      {isImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${currentSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(45px) brightness(0.25) saturate(1.4)',
            opacity: 0.7,
            pointerEvents: 'none',
            transform: 'scale(1.15)',
            zIndex: 1
          }}
        />
      )}

      {/* TOP HEADER CONTROLS */}
      <div
        className="lightbox-header"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
          color: '#fff',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        {/* Title & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: '1 1 auto' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                {title || 'Tampilan Gambar'}
              </h3>
              {cat && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {cat}
                </span>
              )}
            </div>
            {subtitle && (
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Photo Counter */}
          {normalizedImages.length > 1 && (
            <div
              style={{
                fontSize: '0.78rem',
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.14)',
                padding: '4px 10px',
                borderRadius: '999px',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                whiteSpace: 'nowrap'
              }}
            >
              {currentIndex + 1} / {normalizedImages.length}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Zoom controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              padding: '3px 6px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              title="Perkecil (-)"
              style={{
                background: 'transparent',
                border: 'none',
                color: zoom <= 1 ? 'rgba(255, 255, 255, 0.35)' : '#fff',
                cursor: zoom <= 1 ? 'not-allowed' : 'pointer',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <ZoomOutIcon style={{ width: '16px', height: '16px' }} />
            </button>

            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: 600,
                padding: '0 8px',
                color: '#fff',
                minWidth: '46px',
                textAlign: 'center'
              }}
            >
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3.5}
              title="Perbesar (+)"
              style={{
                background: 'transparent',
                border: 'none',
                color: zoom >= 3.5 ? 'rgba(255, 255, 255, 0.35)' : '#fff',
                cursor: zoom >= 3.5 ? 'not-allowed' : 'pointer',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <ZoomInIcon style={{ width: '16px', height: '16px' }} />
            </button>

            {zoom > 1 && (
              <button
                type="button"
                onClick={handleResetZoom}
                title="Reset Zoom (0)"
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  marginLeft: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease'
                }}
              >
                <ResetZoomIcon style={{ width: '12px', height: '12px' }} />
                <span>1:1</span>
              </button>
            )}
          </div>

          {/* Open Original / Download Button */}
          {isImage && (
            <a
              href={currentSrc}
              target="_blank"
              rel="noopener noreferrer"
              download
              title="Buka Gambar Asli / Unduh"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#fff',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <DownloadIcon style={{ width: '17px', height: '17px' }} />
            </a>
          )}

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            title="Tutup (ESC)"
            aria-label="Tutup Galeri"
            style={{
              background: 'rgba(239, 68, 68, 0.85)',
              border: 'none',
              color: '#fff',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <XIcon style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
      </div>

      {/* MAIN VIEWPORT / IMAGE DISPLAY */}
      <div
        ref={imageContainerRef}
        className="lightbox-main-viewport"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        style={{
          position: 'relative',
          flex: 1,
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
          padding: '16px'
        }}
      >
        {/* Navigation Arrow Left */}
        {normalizedImages.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto Sebelumnya"
            title="Foto Sebelumnya (Panah Kiri)"
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.65)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
              boxShadow: '0 6px 20px rgba(0,0,0,0.5)'
            }}
          >
            <ChevronLeftIcon style={{ width: '24px', height: '24px', color: '#fff' }} />
          </button>
        )}

        {/* IMAGE CONTAINER WITH TRANSFORM */}
        <div
          style={{
            maxWidth: '92vw',
            maxHeight: 'calc(100vh - 190px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'center center',
            pointerEvents: 'auto'
          }}
          onClick={(e) => {
            // Prevent closing modal when clicking on the image directly
            e.stopPropagation();
          }}
        >
          {isImage ? (
            <img
              src={currentSrc}
              alt={title || `Foto ${currentIndex + 1}`}
              onError={() => setFailedImages((prev) => ({ ...prev, [currentIndex]: true }))}
              style={{
                maxWidth: '92vw',
                maxHeight: 'calc(100vh - 190px)',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                userSelect: 'none',
                WebkitUserDrag: 'none'
              }}
              draggable={false}
            />
          ) : (
            <div
              style={{
                width: '450px',
                maxWidth: '90vw',
                height: '340px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 16px 48px rgba(0,0,0,0.6)'
              }}
            >
              <ProductSVG
                cat={cat}
                seed={currentItem?.seed || fallbackSeed + currentIndex}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          )}
        </div>

        {/* Navigation Arrow Right */}
        {normalizedImages.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Foto Selanjutnya"
            title="Foto Selanjutnya (Panah Kanan)"
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.65)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
              boxShadow: '0 6px 20px rgba(0,0,0,0.5)'
            }}
          >
            <ChevronRightIcon style={{ width: '24px', height: '24px', color: '#fff' }} />
          </button>
        )}
      </div>

      {/* BOTTOM THUMBNAIL STRIP & KEYBOARD HINTS */}
      <div
        className="lightbox-footer"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 20px 18px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
          gap: '10px'
        }}
      >
        {/* Thumbnails Carousel */}
        {normalizedImages.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              maxWidth: '90vw',
              padding: '10px 14px 16px',
              margin: '-6px 0 0',
              scrollbarWidth: 'none',
              alignItems: 'center'
            }}
          >
            {normalizedImages.map((item, idx) => {
              const isActive = idx === currentIndex;
              const isFailed = failedImages[idx];
              const src = item?.type === 'image' && !isFailed ? withBasePath(item.src) : '';

              return (
                <div
                  key={idx}
                  onClick={() => {
                    resetTransform();
                    setCurrentIndex(idx);
                  }}
                  style={{
                    width: '68px',
                    height: '50px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    cursor: 'pointer',
                    border: isActive ? '2px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: isActive ? '0 0 14px rgba(34, 197, 94, 0.6)' : 'none',
                    opacity: isActive ? 1 : 0.6,
                    transform: isActive ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    background: '#1a202c',
                    position: 'relative'
                  }}
                >
                  {src ? (
                    <img
                      src={src}
                      alt={`Thumbnail ${idx + 1}`}
                      onError={() => setFailedImages((prev) => ({ ...prev, [idx]: true }))}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <ProductSVG
                      cat={cat}
                      seed={item?.seed || fallbackSeed + idx}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Shortcuts Hint */}
        <div
          style={{
            fontSize: '0.74rem',
            color: 'rgba(255, 255, 255, 0.6)',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <span><b>ESC</b> Tutup</span>
          {normalizedImages.length > 1 && <span>• <b>← →</b> Navigasi Foto</span>}
          <span>• <b>Scroll / Klik 2x</b> Zoom</span>
          {zoom > 1 && <span>• <b>Geser (Drag)</b> Memindahkan Tampilan</span>}
        </div>
      </div>
    </div>
  );
}