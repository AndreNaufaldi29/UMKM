import React, { Suspense } from 'react';
import DirectoryView from '../../src/components/DirectoryView';

export const metadata = {
  title: 'Direktori UMKM Desa Sukamaju',
  description: 'Jelajahi, cari, dan filter berbagai usaha mikro, kecil, dan menengah di Desa Sukamaju.',
};

export default function DirectoryPage() {
  return (
    <Suspense fallback={<div className="wrap section"><p>Memuat direktori...</p></div>}>
      <DirectoryView />
    </Suspense>
  );
}
