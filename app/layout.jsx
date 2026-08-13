import { preconnect } from 'react-dom';
import './globals.css';
import { ThemeProvider } from './providers';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { withBasePath } from '../src/utils/basePath';

export const metadata = {
  title: 'Katalog UMKM Desa Kedungsumur',
  description: 'Temukan produk dan jasa unggulan yang ditawarkan oleh para pelaku usaha lokal desa kami.',
  icons: {
    icon: withBasePath('/favicon.svg'),
    shortcut: withBasePath('/favicon.svg'),
    apple: withBasePath('/favicon.svg'),
  },
};

export default function RootLayout({ children }) {
  preconnect('https://fonts.googleapis.com');
  preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' });

  const bgWhite = withBasePath('/white_mode.jpeg');
  const bgDark = withBasePath('/dark_mode.jpeg');

  return (
    <html
      lang="id"
      suppressHydrationWarning
      style={{
        '--bg-white-img': `url("${bgWhite}")`,
        '--bg-dark-img': `url("${bgDark}")`,
      }}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
