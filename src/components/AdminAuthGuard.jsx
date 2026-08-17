'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminIcon } from './Icons';

export default function AdminAuthGuard({ children }) {
  const { isAuthenticated, isInitialized, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isInitialized) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader-brand-mark" style={{ width: '48px', height: '48px' }}>
          <AdminIcon width="24" height="24" />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Silakan masukkan username.');
      return;
    }
    if (!password) {
      setError('Silakan masukkan password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(username, password);
      if (!res.success) {
        setError(res.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat masuk.');
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="admin-login-wrapper" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      <div
        className="panel admin-login-card"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '36px 32px',
          borderRadius: '20px',
          boxShadow: '0 20px 48px -12px rgba(30, 75, 59, 0.25)',
          background: 'var(--paper)',
          border: '1px solid var(--line)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* HEADER BRANDING */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'var(--forest-soft)',
              color: 'var(--forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 20px rgba(30, 75, 59, 0.15)'
            }}
          >
            <AdminIcon width="32" height="32" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>
            Login Administrator
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--ink-soft)', lineHeight: '1.45' }}>
            Masukkan akun administrator untuk mengelola direktori UMKM, produk, dan ulasan desa.
          </p>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div
            style={{
              background: '#FDF2F2',
              border: '1px solid #F8B4B4',
              color: '#9B1C1C',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label htmlFor="adminUsername" style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: 'var(--ink)', marginBottom: '6px' }}>
              Username Admin
            </label>
            <input
              id="adminUsername"
              type="text"
              placeholder="Masukkan username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid var(--line)',
                background: 'var(--paper)',
                color: 'var(--ink)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="adminPassword" style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: 'var(--ink)', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="adminPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--line)',
                  background: 'var(--paper)',
                  color: 'var(--ink)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  opacity: 0.6,
                  padding: '4px'
                }}
                title={showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-soil"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: '600',
              justifyContent: 'center'
            }}
          >
            {isSubmitting ? 'Memproses Login...' : 'Masuk Dashboard Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
