'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('umkm_admin_auth');
      const savedUser = localStorage.getItem('umkm_admin_user');
      if (savedAuth === 'true' && savedUser) {
        setIsAuthenticated(true);
        setAdminUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to load admin auth session:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const login = (username, password) => {
    // Kredensial Admin Default: admin / admin123
    if (username.trim().toLowerCase() === 'admin' && password === 'admin123') {
      const userData = { username: 'admin', role: 'Super Administrator', loginTime: new Date().toISOString() };
      setIsAuthenticated(true);
      setAdminUser(userData);
      localStorage.setItem('umkm_admin_auth', 'true');
      localStorage.setItem('umkm_admin_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Username atau password yang Anda masukkan salah.' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('umkm_admin_auth');
    localStorage.removeItem('umkm_admin_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminUser, isInitialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
