'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter component.
 * Counts up from 0 to targetValue using a cubic ease-out animation.
 * The animation triggers once the element enters the viewport.
 * Falls back to rendering targetValue statically during SSR and if JS is disabled.
 */
export default function AnimatedCounter({ 
  targetValue, 
  duration = 1500, 
  delay = 0, 
  format = (val) => String(val).padStart(2, '0') 
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by noting when we have mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Monitor visibility of the element
  useEffect(() => {
    if (hasAnimated || !mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasAnimated, mounted]);

  // Perform count animation
  useEffect(() => {
    if (!hasAnimated) return;

    let startTimestamp = null;
    const startValue = 0;
    const endValue = Number(targetValue) || 0;
    
    let timeoutId;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      
      // Calculate progress percentage (0 to 1)
      const progress = Math.min(elapsed / duration, 1);
      
      // Cubic ease-out formula: f(t) = 1 - (1 - t)^3
      // Creates a fast start and a smooth slow finish
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate value
      const currentValue = Math.floor(startValue + easeOutProgress * (endValue - startValue));
      
      setCount(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [hasAnimated, targetValue, duration, delay]);

  return (
    <span ref={elementRef} className="animated-counter-value">
      {mounted ? format(count) : format(targetValue)}
    </span>
  );
}
