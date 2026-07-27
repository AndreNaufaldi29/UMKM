'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DataProvider } from '../src/context/DataContext';

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
      <ThemeContext.Provider
        value={{
          dark,
          toggleDark,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </DataProvider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}