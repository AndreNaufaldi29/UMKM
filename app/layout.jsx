import { preconnect } from 'react-dom';
import './globals.css';
import { ThemeProvider } from './providers';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';

export const metadata = {
  title: 'Katalog UMKM Desa kedungsumur',
  description: 'Temukan produk dan jasa unggulan yang ditawarkan oleh para pelaku usaha lokal desa kami.',
};

export default function RootLayout({ children }) {
  preconnect('https://fonts.googleapis.com');
  preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' });

  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
