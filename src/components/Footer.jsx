import React from 'react';
import { TerraceDivider } from './DynamicSVGs';

export default function Footer() {
  return (
    <footer>
      <div className="footer-terrace">
        <TerraceDivider flip />
      </div>
      <div className="footer-inner">
        <div>
          <div className="fbrand">Desa Sukamaju</div>
          <p>Sistem Informasi UMKM Desa — bagian dari Website Profil Desa Sukamaju.</p>
        </div>
        <div className="footer-links">
          <a href="#">Profil Desa</a>
          <a href="#">Berita Desa</a>
          <a href="#">Layanan Publik</a>
          <a href="#">Kontak</a>
        </div>
      </div>
    </footer>
  );
}
