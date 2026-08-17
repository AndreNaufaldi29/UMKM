'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CATEGORIES } from '../data/msmes';
import { withBasePath } from '../utils/basePath';

const DataContext = createContext(null);

const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('umkm_admin_jwt');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};


export function DataProvider({ children }) {
  const [msmes, setMsmes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch initial data dynamically from Database API
  const fetchAllData = useCallback(async () => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      const apiPath = withBasePath('/api/umkm');
      const url = apiPath.startsWith('http') ? apiPath : `${base}${apiPath}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const umkmRes = await fetch(url, {
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (umkmRes.ok && umkmRes.headers.get('content-type')?.includes('application/json')) {
        const umkmData = await umkmRes.json().catch(() => null);
        if (Array.isArray(umkmData)) {
          setMsmes(umkmData);
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching data dynamically from API:', error);
      }
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
      wa: m.wa,
    }))
  );

  // UMKM CRUD Handlers
  const addMsme = async (newMsme) => {
    try {
      const res = await fetch(withBasePath('/api/umkm'), {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(newMsme),
      });
      if (res.ok) {
        await fetchAllData();
        return { success: true };
      } else {
        const data = await res.json().catch(() => null);
        const errMsg = data?.error || `Gagal menyimpan data (${res.status})`;
        alert(`Gagal menyimpan UMKM: ${errMsg}`);
        return { success: false, error: errMsg };
      }
    } catch (e) {
      console.error('Error adding UMKM:', e);
      alert('Tidak dapat terhubung ke server database.');
      return { success: false, error: e.message };
    }
  };

  const updateMsme = async (id, updatedFields) => {
    try {
      const res = await fetch(withBasePath(`/api/umkm/${id}`), {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        await fetchAllData();
        return { success: true };
      } else {
        const data = await res.json().catch(() => null);
        const errMsg = data?.error || `Gagal memperbarui data (${res.status})`;
        alert(`Gagal memperbarui UMKM: ${errMsg}`);
        return { success: false, error: errMsg };
      }
    } catch (e) {
      console.error('Error updating UMKM:', e);
      alert('Tidak dapat terhubung ke server database.');
      return { success: false, error: e.message };
    }
  };

  const deleteMsme = async (id) => {
    try {
      const res = await fetch(withBasePath(`/api/umkm/${id}`), { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
      if (res.ok) {
        await fetchAllData();
        return { success: true };
      } else {
        const data = await res.json().catch(() => null);
        alert(`Gagal menghapus UMKM: ${data?.error || res.status}`);
        return { success: false };
      }
    } catch (e) {
      console.error('Error deleting UMKM:', e);
      alert('Tidak dapat terhubung ke server database.');
      return { success: false };
    }
  };

  // Product CRUD Handlers
  const addProduct = async (msmeId, newProduct) => {
    try {
      const res = await fetch(withBasePath('/api/products'), {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ msmeId, ...newProduct }),
      });
      if (res.ok) {
        await fetchAllData();
        return { success: true };
      } else {
        const data = await res.json().catch(() => null);
        const errMsg = data?.error || `Gagal menambah produk (${res.status})`;
        alert(`Gagal menambah produk: ${errMsg}`);
        return { success: false, error: errMsg };
      }
    } catch (e) {
      console.error('Error adding product:', e);
      alert('Tidak dapat terhubung ke server database.');
      return { success: false, error: e.message };
    }
  };

  const updateProduct = async (productId, updatedFields) => {
    try {
      const res = await fetch(withBasePath(`/api/products/${productId}`), {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        await fetchAllData();
        return { success: true };
      } else {
        const data = await res.json().catch(() => null);
        const errMsg = data?.error || `Gagal memperbarui produk (${res.status})`;
        alert(`Gagal memperbarui produk: ${errMsg}`);
        return { success: false, error: errMsg };
      }
    } catch (e) {
      console.error('Error updating product:', e);
      alert('Tidak dapat terhubung ke server database.');
      return { success: false, error: e.message };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const res = await fetch(withBasePath(`/api/products/${productId}`), { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
      if (res.ok) {
        await fetchAllData();
        return { success: true };
      } else {
        const data = await res.json().catch(() => null);
        alert(`Gagal menghapus produk: ${data?.error || res.status}`);
        return { success: false };
      }
    } catch (e) {
      console.error('Error deleting product:', e);
      alert('Tidak dapat terhubung ke server database.');
      return { success: false };
    }
  };

  // Reset Data Handler
  const resetToDefault = async () => {
    try {
      const res = await fetch(withBasePath('/api/reset'), { method: 'POST', headers: getAuthHeaders(), credentials: 'include' });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        await fetchAllData();
        return { success: true, message: data.message };
      }
      return { success: false, error: data?.error || 'Gagal mereset database' };
    } catch (e) {
      console.error('Error resetting database:', e);
      return { success: false, error: e.message };
    }
  };

  return (
    <DataContext.Provider
      value={{
        msmes,
        products,
        categories: CATEGORIES,
        isLoaded,
        addMsme,
        updateMsme,
        deleteMsme,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefault,
        refreshData: fetchAllData,
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
      msmes: [],
      products: [],
      categories: CATEGORIES,
      isLoaded: true,
      addMsme: async () => ({ success: false }),
      updateMsme: async () => ({ success: false }),
      deleteMsme: async () => ({ success: false }),
      addProduct: async () => ({ success: false }),
      updateProduct: async () => ({ success: false }),
      deleteProduct: async () => ({ success: false }),
      resetToDefault: async () => ({ success: false }),
      refreshData: () => {},
    };
  }
  return context;
}
