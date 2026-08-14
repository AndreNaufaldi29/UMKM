'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MSMES as INITIAL_MSMES, CATEGORIES, DUSUN } from '../data/msmes';
import { withBasePath } from '../utils/basePath';

const DEFAULT_REVIEWS = [];

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [msmes, setMsmes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch initial data dynamically from Database API using withBasePath helper
  const fetchAllData = useCallback(async () => {
    try {
      const [umkmRes, reviewRes] = await Promise.all([
        fetch(withBasePath('/api/umkm'), { cache: 'no-store' }),
        fetch(withBasePath('/api/reviews'), { cache: 'no-store' })
      ]);

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

      if (reviewRes.ok && reviewRes.headers.get('content-type')?.includes('application/json')) {
        const reviewData = await reviewRes.json().catch(() => null);
        if (Array.isArray(reviewData)) {
          setReviews(reviewData);
        } else {
          setReviews(DEFAULT_REVIEWS);
        }
      } else {
        setReviews(DEFAULT_REVIEWS);
      }
    } catch (error) {
      console.error('Error fetching data dynamically from API:', error);
      setMsmes(INITIAL_MSMES);
      setReviews(DEFAULT_REVIEWS);
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
      dusun: m.dusun,
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
      await fetch(withBasePath(`/api/umkm/${id}`), { method: 'DELETE' });
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
      await fetch(withBasePath(`/api/products/${productId}`), { method: 'DELETE' });
      await fetchAllData();
      return;
    } catch (e) {
      console.error('Error deleting product:', e);
    }
  };

  // Review CRUD Handlers
  const addReview = async (newReview) => {
    try {
      const res = await fetch(withBasePath('/api/reviews'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      if (res.ok) {
        await fetchAllData();
        return;
      }
    } catch (e) {
      console.error('Error adding review:', e);
    }
  };

  const updateReview = async (id, updatedFields) => {
    try {
      const res = await fetch(withBasePath(`/api/admin/reviews/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        await fetchAllData();
        return;
      }
    } catch (e) {
      console.error('Error updating review:', e);
    }
  };

  const toggleReviewStatus = async (id, status) => {
    try {
      const res = await fetch(withBasePath(`/api/admin/reviews/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchAllData();
        return;
      }
    } catch (e) {
      console.error('Error toggling review status:', e);
    }
  };

  const deleteReview = async (id) => {
    try {
      await fetch(withBasePath(`/api/admin/reviews/${id}`), { method: 'DELETE' });
      await fetchAllData();
      return;
    } catch (e) {
      console.error('Error deleting review:', e);
    }
  };

  // Reset Data Handler
  const resetToDefault = async () => {
    try {
      await fetch(withBasePath('/api/reset'), { method: 'POST' });
      await fetchAllData();
    } catch (e) {
      console.error('Error resetting database:', e);
    }
  };

  return (
    <DataContext.Provider
      value={{
        msmes: isLoaded ? msmes : INITIAL_MSMES,
        products: isLoaded ? products : INITIAL_MSMES.flatMap((m) => m.products || []),
        reviews: isLoaded ? reviews : DEFAULT_REVIEWS,
        categories: CATEGORIES,
        dusunList: DUSUN,
        isLoaded,
        addMsme,
        updateMsme,
        deleteMsme,
        addProduct,
        updateProduct,
        deleteProduct,
        addReview,
        updateReview,
        toggleReviewStatus,
        deleteReview,
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
      reviews: DEFAULT_REVIEWS,
      categories: CATEGORIES,
      dusunList: DUSUN,
      isLoaded: true,
      addMsme: () => {},
      updateMsme: () => {},
      deleteMsme: () => {},
      addProduct: () => {},
      updateProduct: () => {},
      deleteProduct: () => {},
      addReview: () => {},
      updateReview: () => {},
      toggleReviewStatus: () => {},
      deleteReview: () => {},
      resetToDefault: () => {},
      refreshData: () => {}
    };
  }
  return context;
}
