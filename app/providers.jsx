'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { DataProvider } from '../src/context/DataContext';

const ThemeContext = createContext({
  dark: false,
  toggleDark: () => {},
});

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDark(isDark);
    document.body.classList.toggle('dark', isDark);
  }, []);

  const toggleDark = () => {
    const nextDark = !dark;
    setDark(nextDark);
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    document.body.classList.toggle('dark', nextDark);
  };

  return (
    <DataProvider>
      <ThemeContext.Provider value={{ dark, toggleDark }}>
        {children}
      </ThemeContext.Provider>
    </DataProvider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
