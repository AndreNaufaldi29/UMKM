'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { StarIcon, ArrowIcon } from './Icons';
import { useData } from '../context/DataContext';

export default function TestimonialCarousel() {
  const { reviews } = useData();
  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const TESTIMONIALS = approvedReviews;

  if (!TESTIMONIALS || TESTIMONIALS.length === 0) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
        Belum ada ulasan atau testimoni publik saat ini.
      </div>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimerRef = useRef(null);

  const startAutoplay = () => {
    if (TESTIMONIALS.length <= 1) return;
    stopAutoplay();
    autoplayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
  };

  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isHovered) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
    return () => stopAutoplay();
  }, [isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className="testimonial-carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="testimonial-slides-wrapper">
        {TESTIMONIALS.map((t, idx) => (
          <div 
            key={t.id} 
            className={`testimonial-slide-card ${idx === currentIndex ? 'active' : ''}`}
            aria-hidden={idx !== currentIndex}
          >
            <div className="testimonial-card-header">
              <div className="rating">
                <StarIcon style={{ color: '#FBBF24', width: '15px', height: '15px' }} />
                <StarIcon style={{ color: '#FBBF24', width: '15px', height: '15px' }} />
                <StarIcon style={{ color: '#FBBF24', width: '15px', height: '15px' }} />
                <StarIcon style={{ color: '#FBBF24', width: '15px', height: '15px' }} />
                <StarIcon style={{ color: '#FBBF24', width: '15px', height: '15px' }} />
              </div>
            </div>
            
            <p className="quote">{t.quote}</p>
            
            <div className="testimonial-card-footer">
              <div className="user-info">
                <div className="avatar">{t.avatar}</div>
                <div>
                  <h4 className="name">{t.name}</h4>
                  <span className="role">{t.role}</span>
                </div>
              </div>
              <Link href={t.productLink || (t.msmeId ? `/umkm/${t.msmeId}` : '/umkm')} className="btn btn-outline btn-sm testimonial-action-btn">
                <span>Lihat {t.productName}</span>
                <ArrowIcon style={{ marginLeft: '4px', width: '12px', height: '12px' }} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Navigasi Panah */}
      <button 
        onClick={handlePrev} 
        className="carousel-nav-btn prev"
        aria-label="Testimoni sebelumnya"
      >
        &#10094;
      </button>
      <button 
        onClick={handleNext} 
        className="carousel-nav-btn next"
        aria-label="Testimoni berikutnya"
      >
        &#10095;
      </button>

      {/* Indikator Titik */}
      <div className="testimonial-carousel-dots">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            className={`testimonial-carousel-dot ${currentIndex === i ? 'active' : ''}`}
            onClick={() => handleDotClick(i)}
            aria-label={`Lihat testimoni ${i + 1}`}
            aria-current={currentIndex === i ? 'true' : 'false'}
          ></button>
        ))}
      </div>
    </div>
  );
}
