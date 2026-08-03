'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    let observer = null;

    const setupObserver = () => {
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
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.05,
      };

      observer = new IntersectionObserver(observerCallback, observerOptions);

      const elements = document.querySelectorAll('.reveal, [data-reveal]');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Immediately reveal elements inside or above viewport upon page load/route switch
        if (rect.top < window.innerHeight && rect.bottom > -100) {
          el.classList.add('is-revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    // Run after DOM rendering completes
    const rafId = requestAnimationFrame(() => {
      setupObserver();
    });

    // Safety fallback: reveal all elements after 1.2s to guarantee no hidden elements
    const fallbackTimer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal:not(.is-revealed), [data-reveal]:not(.is-revealed)');
      elements.forEach((el) => el.classList.add('is-revealed'));
    }, 1200);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(fallbackTimer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pathname]);

  return <>{children}</>;
}
