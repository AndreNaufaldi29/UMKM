'use client';

import React from 'react';
import { ShareIcon, PhoneIcon } from './Icons';

export default function DetailActions({ name, wa }) {
  const handleShare = () => {
    const text = encodeURIComponent(`Lihat UMKM "${name}" di Katalog UMKM Desa Sukamaju!`);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button className="btn btn-outline" id="shareBtn" onClick={handleShare}>
        <ShareIcon style={{ marginRight: '6px' }} /> Bagikan
      </button>
      {wa && (
        <a className="btn btn-soil" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
          <PhoneIcon style={{ marginRight: '6px' }} /> Hubungi
        </a>
      )}
    </div>
  );
}
