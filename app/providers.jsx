'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DataProvider } from '../src/context/DataContext';
import { AuthProvider } from '../src/context/AuthContext';
import ScrollReveal from '../src/components/ScrollReveal';
import PageTransitionLoader from '../src/components/PageTransitionLoader';

const ThemeContext = createContext({
  dark: false,
  toggleDark: () => {},
});

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  // Load theme ketika aplikasi dibuka
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    let isDark;

    if (savedTheme) {
      isDark = savedTheme === 'dark';
    } else {
      // Ikuti tema sistem jika belum pernah memilih
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setDark(isDark);
    document.body.classList.toggle('dark', isDark);
  }, []);

  // Simpan perubahan theme
  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleDark = () => {
    setDark(prev => !prev);
  };

  return (
    <DataProvider>
      <AuthProvider>
        <ThemeContext.Provider
          value={{
            dark,
            toggleDark,
          }}
        >
          <PageTransitionLoader />
          <ScrollReveal>{children}</ScrollReveal>
        </ThemeContext.Provider>
      </AuthProvider>
    </DataProvider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}