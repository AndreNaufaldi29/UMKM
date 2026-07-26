'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MSMES as INITIAL_MSMES, CATEGORIES, DUSUN } from '../data/msmes';

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: 'Budi Santoso',
    role: 'Pemilik Cafe, Yogyakarta',
    avatar: 'BS',
    quote: '"Kopi Robusta Sangrai dari Desa Kedungsumur benar-benar luar biasa. Aroma dan konsistensi rasanya sangat disukai oleh pelanggan cafe saya. Pengisian stok selalu aman."',
    msmeId: 1,
    productName: 'Kopi Robusta Sangrai',
    rating: 5,
    status: 'approved',
    date: '2026-07-20'
  },
  {
    id: 2,
    name: 'Dewi Lestari',
    role: 'Wisatawan, Jakarta',
    avatar: 'DL',
    quote: '"Sangat terkesan dengan keindahan Kain Batik Tulis Motif Terasering. Detail cantingnya sangat rapi dan kainnya nyaman dipakai. Mahakarya asli yang bernilai tinggi!"',
    msmeId: 2,
    productName: 'Kain Batik Tulis',
    rating: 5,
    status: 'approved',
    date: '2026-07-22'
  },
  {
    id: 3,
    name: 'Hendra Wijaya',
    role: 'Pencinta Produk Lokal, Bandung',
    avatar: 'HW',
    quote: '"Keranjang anyaman bambunya sangat kuat dan estetik untuk dekorasi rumah. Sangat bangga bisa membeli produk lokal yang ramah lingkungan dengan kualitas premium."',
    msmeId: 3,
    productName: 'Anyaman Bambu',
    rating: 5,
    status: 'approved',
    date: '2026-07-24'
  },
  {
    id: 4,
    name: 'Siti Aminah',
    role: 'Ibu Rumah Tangga',
    avatar: 'SA',
    quote: '"Keripik singkong balado pedas manisnya juara banget! Bumbunya melimpah dan renyah. Anak-anak suka sekali."',
    msmeId: 4,
    productName: 'Keripik Singkong Balado',
    rating: 4,
    status: 'pending',
    date: '2026-07-25'
  }
];

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [msmes, setMsmes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedMsmes = localStorage.getItem('umkm_data_msmes');
      const savedReviews = localStorage.getItem('umkm_data_reviews');

      if (savedMsmes) {
        setMsmes(JSON.parse(savedMsmes));
      } else {
        setMsmes(INITIAL_MSMES);
      }

      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      } else {
        setReviews(DEFAULT_REVIEWS);
      }
    } catch (e) {
      console.error('Error loading data from localStorage', e);
      setMsmes(INITIAL_MSMES);
      setReviews(DEFAULT_REVIEWS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('umkm_data_msmes', JSON.stringify(msmes));
    } catch (e) {
      console.error('Error saving msmes to localStorage', e);
    }
  }, [msmes, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('umkm_data_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error('Error saving reviews to localStorage', e);
    }
  }, [reviews, isLoaded]);

  // Derive products list from MSMEs
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
  const addMsme = (newMsme) => {
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
    return formatted;
  };

  const updateMsme = (id, updatedFields) => {
    setMsmes((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const certs = typeof updatedFields.certs === 'string' 
            ? updatedFields.certs.split('\n').filter(Boolean) 
            : (updatedFields.certs || m.certs);
          return {
            ...m,
            ...updatedFields,
            certs,
            est: parseInt(updatedFields.est || m.est, 10)
          };
        }
        return m;
      })
    );
  };

  const deleteMsme = (id) => {
    setMsmes((prev) => prev.filter((m) => m.id !== id));
  };

  // Product CRUD Handlers
  const addProduct = (msmeId, newProduct) => {
    const targetMsme = msmes.find((m) => m.id === Number(msmeId));
    if (!targetMsme) return null;

    const newProdId = `p${msmeId}_${(targetMsme.products || []).length + 1}_${Date.now().toString().slice(-3)}`;
    const formattedProd = {
      id: newProdId,
      name: newProduct.name,
      desc: newProduct.desc || '',
      price: parseFloat(newProduct.price) || 0,
      unit: newProduct.unit || 'pcs',
      rating: parseFloat(newProduct.rating) || 5.0,
      sales: parseInt(newProduct.sales || '0', 10),
      views: parseInt(newProduct.views || '10', 10),
      isFeatured: !!newProduct.isFeatured
    };

    setMsmes((prev) =>
      prev.map((m) => {
        if (m.id === Number(msmeId)) {
          return {
            ...m,
            products: [...(m.products || []), formattedProd]
          };
        }
        return m;
      })
    );
    return formattedProd;
  };

  const updateProduct = (productId, updatedFields) => {
    setMsmes((prev) =>
      prev.map((m) => {
        const hasProd = (m.products || []).some((p) => p.id === productId);
        if (hasProd) {
          return {
            ...m,
            products: m.products.map((p) => {
              if (p.id === productId) {
                return {
                  ...p,
                  ...updatedFields,
                  price: parseFloat(updatedFields.price ?? p.price),
                  rating: parseFloat(updatedFields.rating ?? p.rating),
                  isFeatured: updatedFields.isFeatured !== undefined ? updatedFields.isFeatured : p.isFeatured
                };
              }
              return p;
            })
          };
        }
        return m;
      })
    );
  };

  const deleteProduct = (productId) => {
    setMsmes((prev) =>
      prev.map((m) => ({
        ...m,
        products: (m.products || []).filter((p) => p.id !== productId)
      }))
    );
  };

  // Review CRUD Handlers
  const addReview = (newReview) => {
    const nextId = reviews.length > 0 ? Math.max(...reviews.map((r) => r.id)) + 1 : 1;
    const nameStr = newReview.name || 'Pengunjung';
    const initials = nameStr.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'UM';

    const formatted = {
      id: nextId,
      name: nameStr,
      role: newReview.role || 'Pembeli Terverifikasi',
      avatar: initials,
      quote: newReview.quote,
      msmeId: Number(newReview.msmeId) || 1,
      productName: newReview.productName || 'Produk UMKM',
      rating: parseFloat(newReview.rating) || 5,
      status: newReview.status || 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    setReviews((prev) => [formatted, ...prev]);
    return formatted;
  };

  const updateReview = (id, updatedFields) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedFields } : r))
    );
  };

  const toggleReviewStatus = (id, status) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const deleteReview = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Reset Data Handler
  const resetToDefault = () => {
    setMsmes(INITIAL_MSMES);
    setReviews(DEFAULT_REVIEWS);
    localStorage.removeItem('umkm_data_msmes');
    localStorage.removeItem('umkm_data_reviews');
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
        resetToDefault
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    // Fallback if rendered outside DataProvider
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
      resetToDefault: () => {}
    };
  }
  return context;
}
