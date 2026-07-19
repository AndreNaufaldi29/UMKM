'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { StarIcon, ArrowIcon } from './Icons';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Budi Santoso',
    role: 'Pemilik Cafe, Yogyakarta',
    avatar: 'BS',
    quote: '"Kopi Robusta Sangrai dari Desa Sukamaju benar-benar luar biasa. Aroma dan konsistensi rasanya sangat disukai oleh pelanggan cafe saya. Pengisian stok selalu aman."',
    productLink: '/umkm/1',
    productName: 'Kopi Robusta Sangrai'
  },
  {
    id: 2,
    name: 'Dewi Lestari',
    role: 'Wisatawan, Jakarta',
    avatar: 'DL',
    quote: '"Sangat terkesan dengan keindahan Kain Batik Tulis Motif Terasering. Detail cantingnya sangat rapi dan kainnya nyaman dipakai. Mahakarya asli yang bernilai tinggi!"',
    productLink: '/umkm/2',
    productName: 'Kain Batik Tulis'
  },
  {
    id: 3,
    name: 'Hendra Wijaya',
    role: 'Pencinta Produk Lokal, Bandung',
    avatar: 'HW',
    quote: '"Keranjang anyaman bambunya sangat kuat dan estetik untuk dekorasi rumah. Sangat bangga bisa membeli produk lokal yang ramah lingkungan dengan kualitas premium."',
    productLink: '/umkm/3',
    productName: 'Anyaman Bambu'
  }
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimerRef = useRef(null);

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
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
              <Link href={t.productLink} className="btn btn-outline btn-sm testimonial-action-btn">
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
