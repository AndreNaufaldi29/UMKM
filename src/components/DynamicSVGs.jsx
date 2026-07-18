import React from 'react';
import { CategoryIcon } from './Icons';

export function TerraceDivider({ flip, ...props }) {
  // layered rice-terrace silhouette signature motif
  return (
    <svg viewBox="0 0 1180 90" preserveAspectRatio="none" style={flip ? { transform: 'scaleY(-1)' } : {}} {...props}>
      <path d="M0,70 L100,55 L220,66 L340,42 L460,58 L580,30 L700,50 L820,20 L940,44 L1060,15 L1180,36 L1180,90 L0,90 Z" fill="var(--sand)" opacity="1" />
      <path d="M0,80 L140,68 L260,78 L400,58 L540,72 L680,50 L820,66 L960,44 L1180,60 L1180,90 L0,90 Z" fill="var(--forest-soft)" opacity=".55" />
    </svg>
  );
}

const catColors = {
  Kuliner: ['#B5651D', '#F0E4D3'],
  Kerajinan: ['#1E4B3B', '#E7EFE9'],
  Fashion: ['#3E7C99', '#E5EFF3'],
  Pertanian: ['#2F6B52', '#E7EFE9'],
  Jasa: ['#5B6156', '#EDEAE0'],
  Wisata: ['#9C6B3E', '#F0E4D3']
};

export function PhotoSVG({ cat, seed, ...props }) {
  const [fg, bg] = catColors[cat] || ['#1E4B3B', '#E7EFE9'];
  const hue = (seed * 47) % 40;
  
  return (
    <svg viewBox="0 0 300 225" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id={`g${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={fg} />
          <stop offset="1" stopColor={fg} stopOpacity=".72" />
        </linearGradient>
      </defs>
      <rect width="300" height="225" fill={bg} />
      <rect width="300" height="225" fill={`url(#g${seed})`} opacity="0" />
      <path d={`M0,150 L60,${130 + hue * 0.5} L130,${145 - hue * 0.3} L200,${115 + hue * 0.4} L260,${135 - hue * 0.2} L300,120 L300,225 L0,225 Z`} fill={fg} opacity=".9" />
      <path d={`M0,175 L80,${160 + hue * 0.3} L160,${172 - hue * 0.2} L240,${150 + hue * 0.3} L300,165 L300,225 L0,225 Z`} fill={fg} opacity=".6" />
      <circle cx="150" cy="82" r="30" fill="rgba(255,255,255,.16)" />
      <g transform="translate(133,65)" color="#fff" opacity=".95">
        <CategoryIcon cat={cat} width="34" height="34" />
      </g>
    </svg>
  );
}

export function ProductSVG({ cat, seed, ...props }) {
  const [fg, bg] = catColors[cat] || ['#1E4B3B', '#E7EFE9'];
  const cx1 = 60 + ((seed * 20) % 80);
  const cy1 = 70 + ((seed * 13) % 60);
  const cx2 = 140 - ((seed * 11) % 50);
  const cy2 = 130 - ((seed * 9) % 40);

  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="200" height="200" fill={bg} />
      <circle cx={cx1} cy={cy1} r="46" fill={fg} opacity=".85" />
      <circle cx={cx2} cy={cy2} r="30" fill={fg} opacity=".45" />
    </svg>
  );
}
