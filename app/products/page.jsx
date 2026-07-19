import React, { Suspense } from 'react';
import ProductCatalogView from '../../src/components/ProductCatalogView';

export const metadata = {
  title: 'Katalog Produk UMKM Desa Sukamaju',
  description: 'Temukan produk-produk unggulan terbaik dari berbagai usaha mikro, kecil, dan menengah di Desa Sukamaju.',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="wrap section"><p>Memuat katalog produk...</p></div>}>
      <ProductCatalogView />
    </Suspense>
  );
}
