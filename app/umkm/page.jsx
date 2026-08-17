import React, { Suspense } from 'react';
import DirectoryView from '../../src/components/DirectoryView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Direktori UMKM Desa Kedungsumur',
  description: 'Jelajahi, cari, dan filter berbagai usaha mikro, kecil, dan menengah di Desa Kedungsumur.',
};

export default function DirectoryPage() {
  return (
    <Suspense fallback={<div className="wrap section"><p>Memuat direktori...</p></div>}>
      <DirectoryView />
    </Suspense>
  );
}
