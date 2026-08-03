'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    let observer = null;

    const observerCallback = (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.05,
    };

    observer = new IntersectionObserver(observerCallback, observerOptions);

    const elements = document.querySelectorAll('.reveal, [data-reveal], .reveal-stagger');
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      // Jika elemen berada dalam area tampilan layar saat halaman dimuat/navigasi, langsung jalankan animasi
      if (rect.top < viewportHeight && rect.bottom > 0) {
        el.classList.add('is-revealed');
      } else {
        el.classList.remove('is-revealed');
        observer.observe(el);
      }
    });

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pathname]);

  return <>{children}</>;
}
