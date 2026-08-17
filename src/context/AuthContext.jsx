'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { withBasePath } from '../utils/basePath';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Verify session from server cookie on mount (replaces localStorage-only check)
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(withBasePath('/api/admin/auth/me'), {
          method: 'GET',
          credentials: 'include', // send HttpOnly cookie
        });
        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.authenticated && data.user) {
            setIsAuthenticated(true);
            setAdminUser(data.user);
          }
        }
      } catch (e) {
        // Network error — session remains unauthenticated
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
        credentials: 'include', // receive HttpOnly cookie in response
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json().catch(() => null);

        if (res.status === 429) {
          return { success: false, error: data?.error || 'Terlalu banyak percobaan. Coba lagi nanti.' };
        }

        if (res.ok && data && data.success) {
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
      await fetch(withBasePath('/api/admin/auth/logout'), {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.warn('Logout request failed:', e);
    } finally {
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
