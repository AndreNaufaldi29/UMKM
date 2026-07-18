'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowIcon } from './Icons';
import { TerraceDivider } from './DynamicSVGs';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef(null);
  const slidesCount = 3;

  const startCarousel = () => {
    stopCarousel();
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 5000);
  };

  const stopCarousel = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startCarousel();
    return () => stopCarousel();
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount);
    startCarousel();
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesCount);
    startCarousel();
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    startCarousel();
  };

  return (
    <section className="hero hero-carousel">
      <div className="hero-slides">
        <div className={`hero-slide ${currentSlide === 0 ? 'active' : ''}`}>
          <img src="/images/umkm-1.jpg" alt="UMKM Desa Sukamaju" />
        </div>
        <div className={`hero-slide ${currentSlide === 1 ? 'active' : ''}`}>
          <img src="/images/umkm-2.jpg" alt="Produk UMKM Desa" />
        </div>
        <div className={`hero-slide ${currentSlide === 2 ? 'active' : ''}`}>
          <img src="/images/umkm-3.jpg" alt="Pelaku UMKM Desa" />
        </div>
      </div>

      <div className="hero-overlay"></div>

      <button
        className="carousel-arrow carousel-prev"
        onClick={handlePrev}
        aria-label="Slide sebelumnya"
      >
        &#10094;
      </button>

      <button
        className="carousel-arrow carousel-next"
        onClick={handleNext}
        aria-label="Slide berikutnya"
      >
        &#10095;
      </button>

      <div className="hero-inner carousel-content">
        <div className="eyebrow">Sistem Informasi UMKM Desa</div>
        <h1>Katalog UMKM Desa Sukamaju</h1>
        <p>
          Temukan produk dan jasa unggulan yang ditawarkan oleh para pelaku usaha lokal desa kami.
        </p>
        <Link href="/directory" className="btn btn-soil">
          Jelajahi Semua UMKM
          <ArrowIcon style={{ marginLeft: '8px' }} />
        </Link>
      </div>

      <div className="carousel-dots">
        {Array.from({ length: slidesCount }).map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${currentSlide === i ? 'active' : ''}`}
            onClick={() => handleDotClick(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={currentSlide === i ? 'true' : 'false'}
          ></button>
        ))}
      </div>

      <div className="terrace">
        <TerraceDivider />
      </div>
    </section>
  );
}
