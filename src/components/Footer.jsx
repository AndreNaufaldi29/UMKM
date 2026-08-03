import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="fbrand">Desa Kedungsumur</div>
          <p>Sistem Informasi UMKM Desa — bagian dari Website Profil Desa Kedungsumur.</p>
        </div>
        <div className="footer-links">
          <Link href="/">Beranda</Link>
          <Link href="/umkm">UMKM Desa</Link>
          <Link href="/products">Katalog Produk</Link>
        </div>
      </div>
    </footer>
  );
}
