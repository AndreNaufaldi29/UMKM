'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { withBasePath } from '../utils/basePath';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Verify session on mount (Cookie + LocalStorage Bearer Token)
  useEffect(() => {
    async function checkSession() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('umkm_admin_jwt') : null;
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(withBasePath('/api/admin/auth/me'), {
          method: 'GET',
          headers,
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.authenticated && data.user) {
            setIsAuthenticated(true);
            setAdminUser(data.user);
          } else if (token) {
            localStorage.removeItem('umkm_admin_jwt');
          }
        }
      } catch (e) {
        console.warn('Session check failed:', e);
      } finally {
        setIsInitialized(true);
      }
    }
    checkSession();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch(withBasePath('/api/admin/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json().catch(() => null);

        if (res.status === 429) {
          return { success: false, error: data?.error || 'Terlalu banyak percobaan. Coba lagi nanti.' };
        }

        if (res.ok && data && data.success) {
          if (data.token && typeof window !== 'undefined') {
            localStorage.setItem('umkm_admin_jwt', data.token);
          }
          setIsAuthenticated(true);
          setAdminUser(data.user);
          return { success: true };
        }

        if (data && data.error) {
          return { success: false, error: data.error };
        }
      }

      return { success: false, error: 'Terjadi kesalahan. Silakan coba lagi.' };
    } catch (e) {
      console.error('Login error:', e);
      return { success: false, error: 'Tidak dapat terhubung ke server. Periksa koneksi Anda.' };
    }
  };

  const logout = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('umkm_admin_jwt') : null;
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(withBasePath('/api/admin/auth/logout'), {
        method: 'POST',
        headers,
        credentials: 'include',
      });
    } catch (e) {
      console.warn('Logout request failed:', e);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('umkm_admin_jwt');
      }
      setIsAuthenticated(false);
      setAdminUser(null);
    }
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
