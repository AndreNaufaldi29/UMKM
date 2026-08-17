'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MSMES as INITIAL_MSMES, CATEGORIES } from '../data/msmes';
import { withBasePath } from '../utils/basePath';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [msmes, setMsmes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch initial data dynamically from Database API using withBasePath helper
  const fetchAllData = useCallback(async () => {
    try {
      // Gunakan URL absolut agar fetch() selalu berhasil (origin + path)
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      const apiPath = withBasePath('/api/umkm');
      const url = apiPath.startsWith('http') ? apiPath : `${base}${apiPath}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 detik timeout

      const umkmRes = await fetch(url, {
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (umkmRes.ok && umkmRes.headers.get('content-type')?.includes('application/json')) {
        const umkmData = await umkmRes.json().catch(() => null);
        if (Array.isArray(umkmData)) {
          setMsmes(umkmData);
        } else {
          setMsmes(INITIAL_MSMES);
        }
      } else {
        setMsmes(INITIAL_MSMES);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Fetch /api/umkm timed out, falling back to static data.');
      } else {
        console.error('Error fetching data dynamically from API:', error);
      }
      setMsmes(INITIAL_MSMES);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchAllData();

    const onFocus = () => fetchAllData();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchAllData]);

  // Derive products list from MSMEs dynamically
  const products = msmes.flatMap((m) =>
    (m.products || []).map((p) => ({
      ...p,
      msmeId: m.id,
      msmeName: m.name,
      cat: m.cat,
      status: m.status,
      wa: m.wa
    }))
  );

  // UMKM CRUD Handlers
  const addMsme = async (newMsme) => {
    try {
      const res = await fetch(withBasePath('/api/umkm'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newMsme)
      });
      if (res.ok) {
        await fetchAllData();
        return;
      }
    } catch (e) {
      console.error('Error adding UMKM:', e);
    }
    const nextId = msmes.length > 0 ? Math.max(...msmes.map((x) => x.id)) + 1 : 1;
    const formatted = {
      ...newMsme,
      id: nextId,
      est: parseInt(newMsme.est, 10) || new Date().getFullYear(),
      status: newMsme.status || 'active',
      certs: typeof newMsme.certs === 'string' ? newMsme.certs.split('\n').filter(Boolean) : (newMsme.certs || []),
      products: newMsme.products || []
    };
    setMsmes((prev) => [formatted, ...prev]);
  };

  const updateMsme = async (id, updatedFields) => {
    try {
      const res = await fetch(withBasePath(`/api/umkm/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        await fetchAllData();
        return;
      }
    } catch (e) {
      console.error('Error updating UMKM:', e);
    }
    setMsmes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    );
  };

  const deleteMsme = async (id) => {
    try {
      await fetch(withBasePath(`/api/umkm/${id}`), { method: 'DELETE', credentials: 'include' });
      await fetchAllData();
      return;
    } catch (e) {
      console.error('Error deleting UMKM:', e);
    }
    setMsmes((prev) => prev.filter((m) => m.id !== id));
  };

  // Product CRUD Handlers
  const addProduct = async (msmeId, newProduct) => {
    try {
      const res = await fetch(withBasePath('/api/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ msmeId, ...newProduct })
      });
      if (res.ok) {
        await fetchAllData();
        return;
      }
    } catch (e) {
      console.error('Error adding product:', e);
    }
  };

  const updateProduct = async (productId, updatedFields) => {
    try {
      const res = await fetch(withBasePath(`/api/products/${productId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        await fetchAllData();
        return;
      }
    } catch (e) {
      console.error('Error updating product:', e);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await fetch(withBasePath(`/api/products/${productId}`), { method: 'DELETE', credentials: 'include' });
      await fetchAllData();
      return;
    } catch (e) {
      console.error('Error deleting product:', e);
    }
  };

  // Reset Data Handler
  const resetToDefault = async () => {
    try {
      const res = await fetch(withBasePath('/api/reset'), { method: 'POST', credentials: 'include' });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        await fetchAllData();
        return { success: true, message: data.message, deleted: data.deleted };
      }
      const errMsg = data?.error || `Server error (${res.status})`;
      return { success: false, error: errMsg };
    } catch (e) {
      console.error('Error resetting database:', e);
      return { success: false, error: e.message || 'Gagal terhubung ke server.' };
    }
  };

  return (
    <DataContext.Provider
      value={{
        msmes: isLoaded ? msmes : INITIAL_MSMES,
        products: isLoaded ? products : INITIAL_MSMES.flatMap((m) => m.products || []),
                categories: CATEGORIES,
                isLoaded,
        addMsme,
        updateMsme,
        deleteMsme,
        addProduct,
        updateProduct,
        deleteProduct,
                resetToDefault,
        refreshData: fetchAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    return {
      msmes: INITIAL_MSMES,
      products: INITIAL_MSMES.flatMap((m) => m.products || []),
            categories: CATEGORIES,
            isLoaded: true,
      addMsme: () => {},
      updateMsme: () => {},
      deleteMsme: () => {},
      addProduct: () => {},
      updateProduct: () => {},
      deleteProduct: () => {},
            resetToDefault: () => {},
      refreshData: () => {}
    };
  }
  return context;
}
