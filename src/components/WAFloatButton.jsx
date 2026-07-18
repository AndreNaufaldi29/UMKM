'use client';

import React from 'react';

export default function WAFloatButton({ waNumber }) {
  if (!waNumber) return null;

  const handleClick = () => {
    window.open(`https://wa.me/${waNumber}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      className="wa-float"
      onClick={handleClick}
      title="Hubungi via WhatsApp"
      aria-label="Hubungi UMKM melalui WhatsApp"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-6.99A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.19 0 4.25.85 5.8 2.4a8.18 8.18 0 0 1 2.4 5.83c0 4.53-3.68 8.22-8.21 8.22a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.15 8.15 0 0 1-1.25-4.35c0-4.53 3.7-8.23 8.23-8.23Z" />
      </svg>
    </button>
  );
}
