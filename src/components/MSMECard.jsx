import React from 'react';
import Link from 'next/link';
import { PinIcon, ArrowIcon, CategoryIcon } from './Icons';
import { PhotoSVG } from './DynamicSVGs';

export default function MSMECard({ m }) {
  return (
    <Link href={`/umkm/${m.id}`} className="card">
      <div className="card-photo">
        <PhotoSVG cat={m.cat} seed={m.id} />
        <div className="card-cat">
          <CategoryIcon cat={m.cat} />
          <span style={{ marginLeft: '4px' }}>{m.cat}</span>
        </div>
        <div className={`card-status ${m.status === 'inactive' ? 'inactive' : ''}`}>
          {m.status === 'inactive' ? 'Tutup' : 'Buka'}
        </div>
      </div>
      <div className="card-body">
        <h3>{m.name}</h3>
        <div className="card-owner">Pemilik: {m.owner}</div>
        <div className="card-addr">
          <PinIcon />
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
