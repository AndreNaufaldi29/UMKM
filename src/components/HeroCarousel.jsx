'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowIcon } from './Icons';
import { withBasePath } from '../utils/basePath';

const SLIDES = [
  {
    image: withBasePath('/images/umkm-1.jpg'),
    eyebrow: 'Sistem Informasi UMKM Desa',
    title: 'Katalog UMKM Desa Kedungsumur',
    desc: 'Temukan produk dan jasa unggulan yang ditawarkan oleh para pelaku usaha lokal desa kami.',
    btnText: 'Jelajahi Semua UMKM',
    link: '/umkm',
  },
  {
    image: withBasePath('/images/umkm-2.jpg'),
    eyebrow: 'Produk Unggulan Warga',
    title: 'Kualitas Terbaik Asli Buatan Lokal',
    desc: 'Dukung kemajuan ekonomi warga desa dengan membeli produk asli buatan tangan masyarakat.',
    btnText: 'Lihat Katalog Produk',
    link: '/produk',
  },
  {
    image: withBasePath('/images/umkm-3.jpg'),
    eyebrow: 'Pemberdayaan Ekonomi Desa',
    title: 'Kemandirian Usaha & Jaringan UMKM',
    desc: 'Wujudkan pertumbuhan ekonomi desa yang inklusif melalui jaringan pelaku usaha yang terintegrasi.',
    btnText: 'Gabung UMKM Desa',
    link: '/umkm',
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef(null);
  const slidesCount = SLIDES.length;

  const slidesRef = useRef(null);
  const contentRef = useRef(null);

  const startCarousel = () => {
    stopCarousel();
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 4000);
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

  useEffect(() => {
    let rafId = null;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY <= window.innerHeight * 1.2) {
          if (slidesRef.current) {
            slidesRef.current.style.transform = `translate3d(0, ${scrollY * 0.35}px, 0)`;
          }
          if (contentRef.current) {
            contentRef.current.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
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

  const slide = SLIDES[currentSlide];

  return (
    <section className="hero hero-carousel">
      <div 
        ref={slidesRef}
        className="hero-slides" 
      >
        {SLIDES.map((s, i) => (
          <div key={i} className={`hero-slide ${currentSlide === i ? 'active' : ''}`}>
            <img src={s.image} alt={s.title} />
          </div>
        ))}
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

      <div 
        ref={contentRef}
        className="hero-inner carousel-content"
      >
        <div className="eyebrow">{slide.eyebrow}</div>
        <h1>{slide.title}</h1>
        <p>{slide.desc}</p>
        <Link href={slide.link} className="btn btn-soil">
          {slide.btnText}
          <ArrowIcon style={{ marginLeft: '8px' }} />
        </Link>
      </div>

      <div className="carousel-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${currentSlide === i ? 'active' : ''}`}
            onClick={() => handleDotClick(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={currentSlide === i ? 'true' : 'false'}
          ></button>
        ))}
      </div>
    </section>
  );
}
