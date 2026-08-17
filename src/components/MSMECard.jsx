'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PinIcon, ArrowIcon, CategoryIcon } from './Icons';
import { PhotoSVG } from './DynamicSVGs';
import { withBasePath } from '../utils/basePath';

export default function MSMECard({ m }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/umkm/${m.id}`} className="card" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-photo">
        {m.imageUrl && !imgError ? (
          <img
            src={withBasePath(m.imageUrl)}
            alt={m.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <PhotoSVG cat={m.cat} seed={m.id} />
        )}
        <div 
          className="card-cat"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/umkm?cat=${encodeURIComponent(m.cat)}`);
          }}
          style={{ cursor: 'pointer' }}
        >
          <CategoryIcon cat={m.cat} />
          <span style={{ marginLeft: '4px' }}>{m.cat}</span>
        </div>
        <div className={`card-status ${m.status === 'inactive' ? 'inactive' : ''}`}>
          {m.status === 'inactive' ? 'Tutup' : 'Buka'}
        </div>
      </div>
      <div className="card-body">
        <h3 title={m.name}>{m.name}</h3>
        <div className="card-owner">Pemilik: {m.owner}</div>
        <div className="card-addr">
          <PinIcon style={{ flexShrink: 0, marginTop: '3px' }} />
          <span>{m.addr}</span>
        </div>
        <div className="card-foot">
          <span className="card-est mono">Est. {m.est}</span>
          <span className="card-view">
            Lihat Detail <ArrowIcon style={{ marginLeft: '4px' }} />
          </span>
        </div>
      </div>
    </Link>
  );
}
