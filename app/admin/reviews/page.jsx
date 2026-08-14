'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminReviewsPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/admin');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="panel admin-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Modul Review Dinonaktifkan</h2>
      <p style={{ color: 'var(--ink-soft)', marginBottom: '20px' }}>
        Fitur ulasan pembeli telah dihapus secara permanen dari sistem.
      </p>
      <Link href="/admin" className="btn btn-soil">
        Kembali ke Dashboard Admin
      </Link>
    </div>
  );
}